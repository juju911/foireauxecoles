import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, Send, X, Bot, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Bonjour ! Je suis votre assistant pour La Foire aux Écoles 2025. Comment puis-je vous aider ?',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll vers le bas quand de nouveaux messages arrivent
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      console.log('Envoi du message:', inputMessage);
      
      const { data, error } = await supabase.functions.invoke('ai-chatbot', {
        body: { message: inputMessage }
      });

      console.log('Réponse reçue:', { data, error });

      if (error) {
        console.error('Erreur Supabase:', error);
        throw error;
      }

      if (!data || data.response === undefined || data.response === null) {
        console.error('Réponse invalide:', data);
        throw new Error('Réponse invalide du serveur');
      }

      // Si la réponse est vide, afficher un message par défaut
      const responseText = data.response.trim() || 'Désolé, je n\'ai pas pu générer une réponse. Pouvez-vous reformuler votre question ?';

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: responseText,
        sender: 'bot',
        timestamp: new Date()
      };

      console.log('Message bot créé:', botMessage);
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Erreur chatbot complète:', error);
      
      // Message d'erreur plus détaillé pour l'utilisateur
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      
      const errorBotMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `Désolé, je rencontre une difficulté technique. Erreur: ${errorMessage}. Veuillez réessayer dans quelques instants.`,
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorBotMessage]);
      
      toast({
        title: "Erreur",
        description: "Impossible de contacter l'assistant. Veuillez réessayer.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Chat Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="h-14 w-14 rounded-full bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700 hover:from-orange-600 hover:via-orange-700 hover:to-orange-800 shadow-lg hover:shadow-xl transition-all duration-200 border-2 border-white/20"
        >
          <MessageCircle className="h-6 w-6 text-white" />
        </Button>
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-96 max-w-[calc(100vw-3rem)] h-[600px] max-h-[calc(100vh-200px)] animate-fade-in">
          <Card className="h-full flex flex-col shadow-2xl border border-primary/30 bg-white/95 backdrop-blur-sm rounded-xl overflow-hidden">
            <CardHeader className="flex-row items-center justify-between space-y-0 p-4 bg-gradient-to-r from-primary via-primary/90 to-primary/80 text-white">
              <CardTitle className="text-lg font-semibold">
                🎓 Assistant Foire aux Écoles
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white/20 h-8 w-8 p-0 rounded-full"
              >
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>

            <CardContent className="flex-1 flex flex-col p-0 min-h-0">
              {/* Messages */}
              <ScrollArea className="flex-1 p-4 max-h-full">
                <div className="space-y-4 pb-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex items-start gap-3 max-w-full ${
                        message.sender === 'user' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      {message.sender === 'bot' && (
                        <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0 mt-1">
                          <Bot className="w-4 h-4 text-primary" />
                        </div>
                      )}
                      <div
                        className={`max-w-[260px] rounded-2xl px-4 py-3 text-sm leading-relaxed break-words ${
                          message.sender === 'user'
                            ? 'bg-primary text-white ml-auto rounded-br-md shadow-md'
                            : 'bg-gray-100 text-gray-800 border border-gray-200 shadow-sm'
                        }`}
                      >
                        {message.content}
                      </div>
                      {message.sender === 'user' && (
                        <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0 mt-1">
                          <User className="w-4 h-4 text-primary" />
                        </div>
                      )}
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center mt-1">
                        <Bot className="w-4 h-4 text-primary" />
                      </div>
                      <div className="bg-gray-100 border border-gray-200 rounded-2xl px-4 py-3 text-sm shadow-sm">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-primary/70 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-primary/70 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-primary/70 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                  {/* Élément invisible pour forcer le scroll vers le bas */}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              {/* Input */}
              <div className="p-4 border-t border-gray-200 bg-gray-50/80 backdrop-blur-sm">
                <div className="flex gap-3 items-end">
                  <Input
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Posez votre question..."
                    disabled={isLoading}
                    className="flex-1 rounded-full border-gray-300 bg-white shadow-sm focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                  <Button
                    onClick={sendMessage}
                    disabled={!inputMessage.trim() || isLoading}
                    size="sm"
                    className="h-10 w-10 rounded-full bg-primary hover:bg-primary/90 shadow-md flex-shrink-0"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};

export default ChatBot;
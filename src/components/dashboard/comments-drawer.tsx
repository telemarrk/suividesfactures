
"use client";

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Invoice, Comment, UserRole, Service } from "@/lib/types";
import { Avatar, AvatarFallback } from '../ui/avatar';
import { CircleUser } from 'lucide-react';
import { Separator } from '../ui/separator';
import { services as defaultServices } from '@/lib/data';

const SERVICES_STORAGE_KEY = "app_services";

interface CommentsDrawerProps {
  invoice: Invoice | null;
  isOpen: boolean;
  onClose: () => void;
  onCommentSubmit: (invoiceId: string, comments: Comment[]) => void;
  userService: UserRole | null;
}

export function CommentsDrawer({ invoice, isOpen, onClose, onCommentSubmit, userService }: CommentsDrawerProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [allServices, setAllServices] = useState<Service[]>([]);

  useEffect(() => {
    if (invoice) {
      setComments(invoice.comments);
    }
    const storedServices = localStorage.getItem(SERVICES_STORAGE_KEY);
    setAllServices(storedServices ? JSON.parse(storedServices) : defaultServices);
  }, [invoice]);

  const handlePostComment = () => {
    if (newComment.trim() === "" || !invoice || !userService) return;

    const comment: Comment = {
      id: `c${new Date().getTime()}`,
      author: `${userService}`,
      authorRole: userService,
      timestamp: new Date().toISOString(),
      content: newComment,
    };

    const updatedComments = [...comments, comment];
    setComments(updatedComments);
    onCommentSubmit(invoice.id, updatedComments);
    setNewComment("");
    onClose(); // Ferme automatiquement la fenêtre
  };
  
  const getAuthorDescription = (author: string): string => {
    try {
        const service = allServices.find(s => s.name === author);
        return service ? service.description : author;
    } catch (e) {
        return author;
    }
  }

  if (!invoice) return null;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-lg w-[90vw] flex flex-col">
        <SheetHeader className="pr-6">
          <SheetTitle>Commentaires pour {invoice.fileName}</SheetTitle>
          <SheetDescription>
            Voir et ajouter des commentaires. Le workflow sera mis à jour en conséquence.
          </SheetDescription>
        </SheetHeader>
        <Separator />
        <ScrollArea className="flex-grow pr-6 -mr-6">
            <div className="space-y-4 py-4">
            {comments.length > 0 ? (
                comments.map((comment) => (
                <div key={comment.id} className="flex gap-3">
                    <Avatar>
                        <AvatarFallback><CircleUser /></AvatarFallback>
                    </Avatar>
                    <div className="grid gap-1.5">
                        <div className="flex items-center gap-2">
                            <div className="font-semibold">{getAuthorDescription(comment.author)}</div>
                            <div className="text-xs text-muted-foreground">
                                {new Date(comment.timestamp).toLocaleString()}
                            </div>
                        </div>
                        <p className="text-sm leading-snug">{comment.content}</p>
                    </div>
                </div>
                ))
            ) : (
                <p className="text-sm text-muted-foreground text-center py-8">Aucun commentaire pour le moment.</p>
            )}
            </div>
        </ScrollArea>
        <Separator />
        <SheetFooter>
            <div className="grid gap-4 py-4 w-full">
                <Textarea
                placeholder="Ajouter un commentaire..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                />
                <Button onClick={handlePostComment}>Envoyer le commentaire</Button>
            </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

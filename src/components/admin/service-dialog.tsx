"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Service } from "@/lib/types"
import { useEffect, useState } from "react"

interface ServiceDialogProps {
    isOpen: boolean
    onClose: () => void
    onSave: (service: Service) => void
    service: Service | null
}

export function ServiceDialog({ isOpen, onClose, onSave, service }: ServiceDialogProps) {
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')

    useEffect(() => {
        if(service) {
            setName(service.name)
            setDescription(service.description)
        } else {
            setName('')
            setDescription('')
        }
    }, [service])

    const handleSave = () => {
        // Basic validation
        if(!name || !description) return

        onSave({
            id: service?.id || new Date().toISOString(),
            name: name as any, // In a real app, use a select with UserRole
            description,
        })
    }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{service ? 'Modifier le service' : 'Ajouter un service'}</DialogTitle>
          <DialogDescription>
            {service ? "Modifiez les détails du service." : "Ajoutez un nouveau service à la liste."}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Nom
            </Label>
            <Input id="name" value={name} onChange={e => setName(e.target.value)} className="col-span-3" placeholder="SGRH" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Input id="description" value={description} onChange={e => setDescription(e.target.value)} className="col-span-3" placeholder="Ressources Humaines" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Annuler</Button>
          <Button type="submit" onClick={handleSave}>Enregistrer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

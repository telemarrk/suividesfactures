
"use client"

import { useState, useEffect } from "react"
import { MoreHorizontal, PlusCircle, Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ServiceDialog } from "./service-dialog"
import type { Service } from "@/lib/types"

const SERVICES_STORAGE_KEY = "app_services";

interface ServiceTableClientProps {
  initialServices: Service[]
}

export function ServiceTableClient({ initialServices }: ServiceTableClientProps) {
  const [services, setServices] = useState<Service[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedService, setSelectedService] = useState<Service | null>(null)

  useEffect(() => {
    const storedServices = localStorage.getItem(SERVICES_STORAGE_KEY);
    if (storedServices) {
      setServices(JSON.parse(storedServices));
    } else {
      setServices(initialServices);
      localStorage.setItem(SERVICES_STORAGE_KEY, JSON.stringify(initialServices));
    }
  }, [initialServices]);

  const updateServices = (updatedServices: Service[]) => {
    setServices(updatedServices);
    localStorage.setItem(SERVICES_STORAGE_KEY, JSON.stringify(updatedServices));
  };


  const handleOpenDialog = (service: Service | null = null) => {
    setSelectedService(service)
    setIsDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setSelectedService(null)
  }

  const handleSaveService = (service: Service) => {
    let updatedServices;
    if (selectedService) {
      // Edit
      updatedServices = services.map(s => s.id === service.id ? service : s);
    } else {
      // Add
      updatedServices = [...services, service];
    }
    updateServices(updatedServices);
    handleCloseDialog()
  }

  const handleDeleteService = (serviceId: string) => {
    const updatedServices = services.filter(s => s.id !== serviceId);
    updateServices(updatedServices);
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Services</CardTitle>
          <CardDescription>Gérer les services et leurs descriptions.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom du service</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {services.map(service => (
                <TableRow key={service.id}>
                  <TableCell className="font-medium">{service.name}</TableCell>
                  <TableCell>{service.description}</TableCell>
                  <TableCell>
                    <div className="flex justify-end">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button aria-haspopup="true" size="icon" variant="ghost">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleOpenDialog(service)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Modifier
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDeleteService(service.id)} className="text-red-600 focus:text-red-700 focus:bg-red-50">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Supprimer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="justify-end border-t p-4">
            <Button size="sm" variant="outline" className="h-8 gap-1" onClick={() => handleOpenDialog()}>
                <PlusCircle className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Ajouter un service
                </span>
            </Button>
        </CardFooter>
      </Card>
      <ServiceDialog 
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        onSave={handleSaveService}
        service={selectedService}
      />
    </>
  )
}

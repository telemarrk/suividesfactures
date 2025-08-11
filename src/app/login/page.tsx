"use client";

import Link from "next/link"
import { useTheme } from "next-themes"
import { Moon, Sun, Workflow } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ThemeProvider } from "@/components/theme-provider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { services } from "@/lib/data";
import type { Service, UserRole } from "@/lib/types";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

function ThemeToggle() {
  const { setTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Basculer le thème</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Clair
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Sombre
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          Système
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function LoginPageContent() {
    const router = useRouter();
    const [selectedService, setSelectedService] = useState<UserRole | null>(null);

    const sortedServices = useMemo(() => {
    const specialServices: string[] = ['SGFINANCES', 'SGCOMPUB'];
    const special: Service[] = [];
    const regular: Service[] = [];

    services.forEach(service => {
      if (specialServices.includes(service.name)) {
        special.push(service);
      } else {
        regular.push(service);
      }
    });

    special.sort((a, b) => specialServices.indexOf(a.name) - specialServices.indexOf(b.name));
    regular.sort((a, b) => a.description.localeCompare(b.description));

    return [...special, ...regular];
  }, []);

  const handleLogin = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!selectedService) {
        e.preventDefault();
        alert("Veuillez sélectionner un service.");
        return;
    }
    localStorage.setItem("user_service", selectedService);
    router.push("/dashboard");
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background p-4">
       <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>
      <Card className="mx-auto max-w-sm w-full">
        <CardHeader>
          <div className="flex items-center justify-center gap-2 mb-2">
            <Workflow className="h-8 w-8 text-primary" />
            <CardTitle className="text-2xl font-bold">FacturFlow</CardTitle>
          </div>
          <CardDescription>
            Entrez votre service ci-dessous pour vous connecter
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="service">Nom du service</Label>
              <Select required onValueChange={(value) => setSelectedService(value as UserRole)}>
                  <SelectTrigger id="service">
                      <SelectValue placeholder="Sélectionner un service" />
                  </SelectTrigger>
                  <SelectContent>
                      {sortedServices.map(service => (
                          <SelectItem key={service.id} value={service.name}>
                              {service.description} ({service.name})
                          </SelectItem>
                      ))}
                  </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input id="password" type="password" defaultValue="1234" required />
            </div>
            <Button type="submit" className="w-full" onClick={handleLogin}>
              Se connecter
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function LoginPage() {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <LoginPageContent />
    </ThemeProvider>
  )
}

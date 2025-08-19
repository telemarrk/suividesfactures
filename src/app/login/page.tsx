
"use client";

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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { services as defaultServices } from "@/lib/data";
import type { Service, UserRole } from "@/lib/types";
import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/logo"
import { ThemeToggle } from "@/components/theme-toggle"

const SERVICES_STORAGE_KEY = "app_services";

export default function LoginPage() {
    const router = useRouter();
    const [allServices, setAllServices] = useState<Service[]>([]);
    const [selectedService, setSelectedService] = useState<UserRole | null>(null);
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        const storedServices = localStorage.getItem(SERVICES_STORAGE_KEY);
        const services = storedServices ? JSON.parse(storedServices) : defaultServices;
        setAllServices(services);
        if (!storedServices) {
            localStorage.setItem(SERVICES_STORAGE_KEY, JSON.stringify(defaultServices));
        }
    }, []);


    const sortedServices = useMemo(() => {
        const specialServices: string[] = ['SGFINANCES', 'SGCOMPUB'];
        const special: Service[] = [];
        const regular: Service[] = [];

        allServices.forEach(service => {
        if (specialServices.includes(service.name)) {
            special.push(service);
        } else {
            regular.push(service);
        }
        });

        special.sort((a, b) => specialServices.indexOf(a.name) - specialServices.indexOf(b.name));
        regular.sort((a, b) => a.description.localeCompare(b.description));

        return [...special, ...regular];
  }, [allServices]);

  const handleLogin = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!selectedService) {
        setError("Veuillez sélectionner un service.");
        return;
    }

    let correctPassword = "";
    if (selectedService === 'SGFINANCES' || selectedService === 'SGCOMPUB') {
        correctPassword = '1234';
    } else {
        const serviceData = allServices.find(s => s.name === selectedService);
        correctPassword = serviceData?.password || '';
    }

    if (password === correctPassword && correctPassword !== '') {
        localStorage.setItem("user_service", selectedService);
        router.push("/dashboard");
    } else {
        setError("Mot de passe incorrect.");
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background p-4">
       <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>
      <Card className="mx-auto max-w-sm w-full">
        <CardHeader>
          <div className="flex items-center justify-center gap-2 mb-2">
            <Logo isLoginPage={true} />
          </div>
          <CardDescription>
            Entrez votre service ci-dessous pour vous connecter
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
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
                <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
              </div>
              {error && <p className="text-sm font-medium text-destructive">{error}</p>}
              <Button type="submit" className="w-full" onClick={handleLogin}>
                Se connecter
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

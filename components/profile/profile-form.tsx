"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { FormDescription } from "@/components/ui/form";

interface ProfileFormProps {
  user: any;
  onSave: (data: any) => void;
  onCancel: () => void;
}

export function ProfileForm({ user, onSave, onCancel }: ProfileFormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data = Object.fromEntries(formData);
    onSave({
      ...data,
      phone_public: formData.get('phone_public') === 'on',
      speed: parseInt(formData.get('speed') as string),
      pace: parseInt(formData.get('pace') as string),
      power: parseInt(formData.get('power') as string),
    });
  };

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6 pt-6">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input 
              id="username" 
              name="username" 
              defaultValue={user?.username} 
              required 
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone_number">Τηλέφωνο</Label>
            <Input 
              id="phone_number" 
              name="phone_number" 
              defaultValue={user?.phone_number} 
              type="tel"
            />
          </div>

          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label>Εμφάνιση τηλεφώνου</Label>
              <FormDescription>
                Επιτρέψτε στους άλλους παίκτες να δουν το τηλέφωνό σας
              </FormDescription>
            </div>
            <Switch 
              name="phone_public"
              defaultChecked={user?.phone_public}
            />
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Ταχύτητα ({user?.speed || 3})</Label>
              <Slider
                name="speed"
                min={1}
                max={5}
                step={1}
                defaultValue={[user?.speed || 3]}
              />
            </div>

            <div className="space-y-2">
              <Label>Αντοχή ({user?.pace || 3})</Label>
              <Slider
                name="pace"
                min={1}
                max={5}
                step={1}
                defaultValue={[user?.pace || 3]}
              />
            </div>

            <div className="space-y-2">
              <Label>Δύναμη ({user?.power || 3})</Label>
              <Slider
                name="power"
                min={1}
                max={5}
                step={1}
                defaultValue={[user?.power || 3]}
              />
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex justify-end gap-2">
          <Button variant="outline" type="button" onClick={onCancel}>
            Ακύρωση
          </Button>
          <Button type="submit">
            Αποθήκευση
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
} 
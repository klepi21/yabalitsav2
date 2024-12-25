"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
  username: z.string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be less than 20 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers and underscores"),
  phone_number: z.string().optional(),
  phone_public: z.boolean().default(false),
  speed: z.number().min(1).max(5),
  pace: z.number().min(1).max(5),
  power: z.number().min(1).max(5),
});

interface ProfileFormProps {
  user: any;
  onSave: (data: any) => void;
  onCancel: () => void;
}

export function ProfileForm({ user, onSave, onCancel }: ProfileFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: user?.username || "",
      phone_number: user?.phone_number || "",
      phone_public: user?.phone_public || false,
      speed: user?.speed || 3,
      pace: user?.pace || 3,
      power: user?.power || 3,
    },
  });

  return (
    <Card>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSave)}>
          <CardContent className="space-y-6 pt-6">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Τηλέφωνο</FormLabel>
                  <FormControl>
                    <Input type="tel" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone_public"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel>Εμφάνιση τηλεφώνου</FormLabel>
                    <FormDescription>
                      Επιτρέψτε στους άλλους παίκτες να δουν το τηλέφωνό σας
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <FormField
                control={form.control}
                name="speed"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel>Ταχύτητα ({field.value})</FormLabel>
                    <FormControl>
                      <Slider
                        min={1}
                        max={5}
                        step={1}
                        value={[field.value]}
                        onValueChange={([value]) => field.onChange(value)}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="pace"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel>Αντοχή ({field.value})</FormLabel>
                    <FormControl>
                      <Slider
                        min={1}
                        max={5}
                        step={1}
                        value={[field.value]}
                        onValueChange={([value]) => field.onChange(value)}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="power"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel>Δύναμη ({field.value})</FormLabel>
                    <FormControl>
                      <Slider
                        min={1}
                        max={5}
                        step={1}
                        value={[field.value]}
                        onValueChange={([value]) => field.onChange(value)}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
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
      </Form>
    </Card>
  );
} 
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function RegisterForm({
  className,
  ...props
}) {
  return (
    (<div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="bg-black">
        <CardHeader>
          <CardTitle className="text-2xl text-white">Register</CardTitle>
          <CardDescription>
            Create your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="text" className="text-white">Name</Label>
                <Input id="text" type="text" placeholder="Name" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email" className="text-white">Email</Label>
                <Input id="email" type="email" placeholder="m@example.com" />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password" className="text-white">Password</Label>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline">
                    Forgot your password?
                  </a>
                </div>
                <Input id="password" type="password" />
              </div>
              <Button type="submit" className="w-full bg-white text-black">
                Register
              </Button>
              {/* <Button variant="outline" className="w-full">
                Login with Google
              </Button> */}
            </div>
            <div className="mt-4 text-center text-sm text-white">
              Have&apos;t account?{" "}
              <a href="#" className="underline underline-offset-4">
                Login
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>)
  );
}

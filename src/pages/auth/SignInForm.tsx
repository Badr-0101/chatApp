import { useState } from "react"  
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Link, useNavigate } from "react-router-dom"
import { Form, FormControl, FormField, FormLabel } from "@/components/ui/form"
import * as z from "zod" 
import { Field, FieldError } from "@/components/ui/field"
import { signInUser } from "@/lib/api"
import { useAppDispatch } from "@/store/hooks"
import { setUser } from "@/store/authSlice"


const formSchema = z.object({
email: z.string().min(1, "Email is required").email("Invalid email address"),
password: z.string().min(8, "Password is required"),
})

const SignInForm = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
      },
        mode: "onChange",
    })
    

  async function onSubmit(values: z.infer<typeof formSchema>) {
      setIsLoading(true);
         const result = await signInUser(values);
         if (result.success) {
            dispatch(setUser(result?.data));
        
            navigate("/");
         } else {
    
           setErrorMessage(result.error||null);
           }
         setIsLoading(false);
    }
  return (
    <div className="bg-white p-6 rounded-lg flex  flex-col justify-center space-y-6 w-[80%] sm:w-[350px]">
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Sign In</h1>
        <p className="text-sm text-muted-foreground">
          Enter your email and password to sign in to your account
        </p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field, fieldState }) => (
             <Field data-invalid={fieldState.invalid}>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    className={` ${fieldState.invalid ? "border-red-500" : ""}`}
                    placeholder="name@example.com"
                    {...field}
                    aria-invalid={fieldState.invalid} />
                </FormControl>

              

                {fieldState.invalid && <FieldError errors={[fieldState.error]} className="text-red-500" />}
              </Field>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    className={` ${fieldState.invalid ? "border-red-500" : ""}`}
                    type="password"
                    {...field}
                    aria-invalid={fieldState.invalid} />
                </FormControl>


                {fieldState.invalid && <FieldError errors={[fieldState.error]} className="text-red-500" />}
              </Field>
            )}
          />
          <Button className= {`w-full bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium tracking-tight ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`} type="submit">
            {isLoading ? "Signing In..." : "Sign In"}
          </Button>
          <p className="text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/signup" className="text-blue-500 hover:underline">
              Sign Up
            </Link>
          </p>
          {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}

        </form>
      </Form>
    </div>
  )
}

export default SignInForm
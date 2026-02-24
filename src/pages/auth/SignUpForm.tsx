import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Link, useNavigate } from "react-router-dom"
import { Form, FormControl, FormField, FormLabel } from "@/components/ui/form"
import { Field, FieldError } from "@/components/ui/field"
import { signUpUser, createProfile } from "@/lib/api"
import { useAppDispatch } from "@/store/hooks"
import { setUser } from "@/store/authSlice"
import { toast } from "sonner"
import type{ RequestStatus } from "@/types"


const formSchema = z.object({
    name: z.string().nonempty("name is required").min(3, "Name must be at least 3 characters long"),
    email: z.string().nonempty("email is required").email("Invalid email address"),
    password: z.string().nonempty("password is required").min(8, "Password must be at least 8 characters long"),
})

const SignUpForm = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate();
  const [status, setStatus] = useState<RequestStatus>("idle");

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
        },
        mode: "onChange",
    })

  async function onSubmit(values: z.infer<typeof formSchema>) {
      try {
          setStatus("loading");
          const result = await signUpUser(values);

          if (result.success && result.data?.user) {
              const profileResult = await createProfile(result.data.user.id, {
                  username: values.name,
                email: values.email,
              });
             
              
                dispatch(setUser(result.data))
          
              setStatus("success");
              toast.success("email is created")
  
              if (profileResult.success) {
                  navigate("/profile-update");
              }
          } else {
             console.log("result",result.success)
              setStatus("error");
              throw new Error(result.error);
          }
      } catch (error) {
        console.error(error);
        toast.error(`Sign up failed: ${error}`);
      }finally{
        setStatus("idle");
      }
      
    }

  return (
    <div className="bg-white p-6 rounded-lg flex  flex-col justify-center space-y-6 w-[80%] sm:w-[350px]">
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Sign Up</h1>
        <p className="text-sm text-muted-foreground ">
          Enter your email and password to sign up for an account
        </p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FormLabel>user name</FormLabel>
                <FormControl>
                  <Input
                    className={` ${fieldState.invalid ? "border-red-500" : ""}`}
                    placeholder="Name"
                    {...field}
                    aria-invalid={fieldState.invalid} />
                </FormControl>


                {fieldState.invalid && <FieldError errors={[fieldState.error]} className="text-red-500" />}
              </Field>
            )}
          />
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
          <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium tracking-tight" type="submit" disabled={status === "loading"}>
            {status === "loading" ? "Signing Up..." : "Sign Up"}
          </Button>
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/signin" className="text-blue-500 hover:underline">
              Sign In
            </Link>
          </p>

        </form>
      </Form>
    </div>
  )
}

export default SignUpForm
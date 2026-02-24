import { useState, useEffect } from "react"
import background from "@assets/images/background.png"
import imgPlaceHolder from "@assets/images/Portrait_Placeholder.png"
import logo from "@assets/images/logo.png"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
import { updateProfile, getUserProfile } from "@/lib/api"
import { useAppSelector } from "@/store/hooks"
import { toast } from "sonner"
import type{ RequestStatus } from "@/types"



const ProfileUpdate = () => {

  const navigate = useNavigate()
  const {id} = useAppSelector((state) => state.auth)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [bio, setBio] = useState("")
  const [status, setStatus] = useState<RequestStatus>("idle")

  useEffect(() => {
    const fetchProfile = async () => {
      setStatus("loading")
      if (!id) {
        toast.error("You are not logged in")
        navigate("/login")

        return
      }
   
      const {data, error} = await getUserProfile(id)
      if(error){
        toast.error(error.message)
        setStatus("error")
        return
      }
    
      setBio(data.bio)
      setImagePreview(data.avatar_url)
      setStatus("idle")
    }
    fetchProfile()
    
  },[])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  setStatus("loading")

  const result = await updateProfile(id, {
    bio: bio,
    avatar_url: imagePreview
  })

  setStatus("idle")

  if (result.success) {
    navigate("/")
  } else {
    console.log(result.error)
  }
}
 
  return (
    <div className="flex h-screen w-full items-center justify-around bg-cover bg-center" style={{ backgroundImage: `url(${background})` }}>
      <div className="h-[400px] bg-white rounded-lg shadow-lg flex justify-around items-center gap-4 w-[50%]">
        <form onSubmit={handleSubmit} className="dropzone flex flex-col gap-4">
          <h1 className="text-2xl font-semibold text-center">Profile details</h1>
          


          <div className="flex items-center gap-2">
            <img src={imagePreview || imgPlaceHolder} alt="placeholder" className="w-[75px] h-[75px] rounded-full object-cover" />
            <input 
              type="file" 
              name="file" 
              onChange={handleImageChange}
              accept="image/*"
              className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-tertiary file:text-white hover:file:bg-tertiary/90 file:cursor-pointer text-transparent"
            />
          </div>

          <textarea 
            placeholder="Bio" 
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
          
          <Button 
            type="submit" 
            className="w-full bg-tertiary font-bold text-white"
            disabled={status === "loading"}
          >
            {status === "loading" ? "Saving..." : "Save"}
          </Button>
        </form>
        <img src={imagePreview || logo} alt="avatar" className="w-50 h-50 rounded-full object-cover hidden lg:block" />
      </div>
    </div>
  )
}

export default ProfileUpdate
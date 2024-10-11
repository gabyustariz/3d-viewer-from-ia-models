import React, { useState, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Upload, X } from "lucide-react"

const UploaderForm = () => {
  const [email, setEmail] = useState("")
  const [emailError, setEmailError] = useState("")
  const [selectedOption, setSelectedOption] = useState("")
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [videoPreview, setVideoPreview] = useState<string | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const validateEmail = (email: string) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    return re.test(email)
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value
    setEmail(newEmail)
    if (newEmail && !validateEmail(newEmail)) {
      setEmailError("Please enter a valid email address")
    } else {
      setEmailError("")
    }
  }

  const handleOptionChange = (value: string) => {
    setSelectedOption(value)
  }

  const handleVideoUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type.startsWith("video/")) {
      setVideoFile(file)
      const videoUrl = URL.createObjectURL(file)
      setVideoPreview(videoUrl)
      simulateUpload()
    }
  }

  const simulateUpload = () => {
    let progress = 0
    const interval = setInterval(() => {
      progress += 10
      setUploadProgress(progress)
      if (progress >= 100) {
        clearInterval(interval)
      }
    }, 500)
  }

  const handleRemoveVideo = () => {
    setVideoFile(null)
    setVideoPreview(null)
    setUploadProgress(0)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // Here you would typically send the form data to your server
    console.log("Form submitted", { email, selectedOption, videoFile })
    // Reset form after submission
    setEmail("")
    setSelectedOption("")
    handleRemoveVideo()
  }

  const isFormValid = validateEmail(email) && selectedOption && videoFile && uploadProgress === 100

  return (
    <div className="max-w-md mx-auto p-6 bg-background rounded-lg shadow-lg w-full">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label className="text-black" htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            className="text-black"
            placeholder="Enter your email"
            value={email}
            onChange={handleEmailChange}
            required
          />
          {emailError && <p className="text-sm text-red-500">{emailError}</p>}
        </div>

        <div className="space-y-2">
          <Label className="text-black" htmlFor="option">Select Option</Label>
          <Select value={selectedOption} onValueChange={handleOptionChange} required>
            <SelectTrigger>
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem className="text-black" value="nerf">NERF</SelectItem>
              <SelectItem className="text-black" value="gaussian-splatting">Gaussian Splatting</SelectItem>
              <SelectItem className="text-black" value="nerolangelo">Nerolangelo</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-black" htmlFor="video">Upload Video</Label>
          <div className="relative">
            <Input
              id="video"
              type="file"
              accept="video/*"
              ref={fileInputRef}
              onChange={handleVideoUpload}
              className="hidden"
              required
            />
            {!videoPreview ? (
              <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-primary"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-500">Click to upload or drag and drop</p>
              </div>
            ) : (
              <div className="relative">
                <video
                  src={videoPreview}
                  className="w-full h-48 object-cover rounded-lg"
                  controls
                />
                <button
                  type="button"
                  onClick={handleRemoveVideo}
                  className="absolute top-2 right-2 p-1 bg-background rounded-full shadow-md"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
          {uploadProgress > 0 && uploadProgress < 100 && (
            <div className="space-y-2">
              <Progress value={uploadProgress} className="w-full" />
              <p className="text-sm text-gray-500 text-center">{uploadProgress}% uploaded</p>
            </div>
          )}
        </div>

        <Button type="submit" className="w-full" disabled={!isFormValid}>
          Submit
        </Button>
      </form>
    </div>
  )
}

export default UploaderForm;
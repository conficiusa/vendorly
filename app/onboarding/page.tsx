"use client"

import type React from "react"

import { useState, useRef } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { ArrowRight, ArrowLeft, Upload, Check, ShoppingBag, Store, Search, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function SetupAccountPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    intent: "",
    firstName: "",
    lastName: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
  })

  const fileInputRef = useRef<HTMLInputElement>(null)

  const totalSteps = 4

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1)
      window.scrollTo(0, 0)
    } else {
      // Submit form and redirect
      router.push("/dashboard")
    }
  }

  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1)
      window.scrollTo(0, 0)
    }
  }

  const handleSkip = () => {
    handleNext()
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleRadioChange = (value: string) => {
    setFormData({
      ...formData,
      intent: value,
    })
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        if (e.target?.result) {
          setProfileImage(e.target.result as string)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="min-h-screen bg-rose-50/30 py-12">
      <div className="container mx-auto max-w-3xl px-4">
        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {Array.from({ length: totalSteps }).map((_, index) => (
              <div key={index} className="flex items-center">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full border-2 
                    ${
                      step > index + 1
                        ? "border-rose-500 bg-rose-500 text-white"
                        : step === index + 1
                          ? "border-rose-500 bg-white text-rose-500"
                          : "border-gray-300 bg-white text-gray-300"
                    }`}
                >
                  {step > index + 1 ? <Check className="h-5 w-5" /> : <span>{index + 1}</span>}
                </div>
                {index < totalSteps - 1 && (
                  <div
                    className={`h-1 w-12 sm:w-24 md:w-32 
                      ${step > index + 1 ? "bg-rose-500" : "bg-gray-300"}`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <Card className="border-gray-200 shadow-md">
          {/* Step 1: Welcome */}
          {step === 1 && (
            <>
              <CardHeader className="text-center">
                <CardTitle className="text-3xl font-bold text-gray-900">Welcome to Elegant Marketplace</CardTitle>
                <CardDescription className="text-lg text-gray-600">
                  Let&apos;s set up your account to get the most out of your experience
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 px-6 py-4 sm:px-10">
                <div className="flex justify-center">
                  <div className="rounded-full bg-rose-100 p-6">
                    <User className="h-16 w-16 text-rose-500" />
                  </div>
                </div>
                <div className="space-y-2 text-center">
                  <h3 className="text-xl font-medium">Complete Your Profile</h3>
                  <p className="text-gray-500">
                    This quick setup will help us personalize your experience. You can always change these settings
                    later.
                  </p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end border-t border-gray-100 px-6 py-4 sm:px-10">
                <Button onClick={handleNext} className="bg-rose-500 text-white hover:bg-rose-600">
                  Get Started <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </>
          )}

          {/* Step 2: Usage Intent */}
          {step === 2 && (
            <>
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-gray-900">
                  How do you plan to use Elegant Marketplace?
                </CardTitle>
                <CardDescription className="text-gray-600">
                  This helps us tailor your experience to your needs
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 px-6 py-4 sm:px-10">
                <RadioGroup value={formData.intent} onValueChange={handleRadioChange} className="space-y-4">
                  <div
                    className={`flex cursor-pointer items-center space-x-4 rounded-lg border p-4 transition-all
                    ${formData.intent === "shop" ? "border-rose-500 bg-rose-50" : "border-gray-200 hover:border-rose-200"}`}
                  >
                    <RadioGroupItem value="shop" id="shop" className="border-rose-500 text-rose-500" />
                    <Label htmlFor="shop" className="flex flex-1 cursor-pointer items-center">
                      <ShoppingBag className="mr-3 h-5 w-5 text-rose-500" />
                      <div>
                        <div className="font-medium">I&apos;m here to shop</div>
                        <div className="text-sm text-gray-500">Browse and purchase products from vendors</div>
                      </div>
                    </Label>
                  </div>

                  <div
                    className={`flex cursor-pointer items-center space-x-4 rounded-lg border p-4 transition-all
                    ${formData.intent === "sell" ? "border-rose-500 bg-rose-50" : "border-gray-200 hover:border-rose-200"}`}
                  >
                    <RadioGroupItem value="sell" id="sell" className="border-rose-500 text-rose-500" />
                    <Label htmlFor="sell" className="flex flex-1 cursor-pointer items-center">
                      <Store className="mr-3 h-5 w-5 text-rose-500" />
                      <div>
                        <div className="font-medium">I&apos;m here to sell</div>
                        <div className="text-sm text-gray-500">List and sell your products on our marketplace</div>
                      </div>
                    </Label>
                  </div>

                  <div
                    className={`flex cursor-pointer items-center space-x-4 rounded-lg border p-4 transition-all
                    ${formData.intent === "browse" ? "border-rose-500 bg-rose-50" : "border-gray-200 hover:border-rose-200"}`}
                  >
                    <RadioGroupItem value="browse" id="browse" className="border-rose-500 text-rose-500" />
                    <Label htmlFor="browse" className="flex flex-1 cursor-pointer items-center">
                      <Search className="mr-3 h-5 w-5 text-rose-500" />
                      <div>
                        <div className="font-medium">Just browsing</div>
                        <div className="text-sm text-gray-500">I&apos;m not sure yet, just checking things out</div>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </CardContent>
              <CardFooter className="flex justify-between border-t border-gray-100 px-6 py-4 sm:px-10">
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  className="border-gray-200 text-gray-600 hover:bg-gray-50"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
                <Button
                  onClick={handleNext}
                  disabled={!formData.intent}
                  className="bg-rose-500 text-white hover:bg-rose-600"
                >
                  Continue <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </>
          )}

          {/* Step 3: Profile Image */}
          {step === 3 && (
            <>
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-gray-900">Upload a profile picture</CardTitle>
                <CardDescription className="text-gray-600">Add a photo to personalize your account</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 px-6 py-4 sm:px-10">
                <div className="flex flex-col items-center justify-center space-y-4">
                  <div className="relative h-32 w-32 overflow-hidden rounded-full border-4 border-rose-100">
                    {profileImage ? (
                      <Image
                        src={profileImage || "/placeholder.svg"}
                        alt="Profile preview"
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-rose-50 text-rose-300">
                        <User className="h-16 w-16" />
                      </div>
                    )}
                  </div>

                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="hidden"
                  />

                  <Button
                    type="button"
                    onClick={triggerFileInput}
                    variant="outline"
                    className="border-rose-200 text-rose-600 hover:bg-rose-50"
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    {profileImage ? "Change photo" : "Upload photo"}
                  </Button>

                  <p className="text-sm text-gray-500">Recommended: Square image, at least 300x300 pixels</p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t border-gray-100 px-6 py-4 sm:px-10">
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  className="border-gray-200 text-gray-600 hover:bg-gray-50"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
                <div className="space-x-2">
                  <Button variant="ghost" onClick={handleSkip} className="text-gray-500 hover:bg-gray-50">
                    Skip for now
                  </Button>
                  <Button
                    onClick={handleNext}
                    disabled={!profileImage}
                    className="bg-rose-500 text-white hover:bg-rose-600"
                  >
                    Continue <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardFooter>
            </>
          )}

          {/* Step 4: Address Information */}
          {step === 4 && (
            <>
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-gray-900">Your address information</CardTitle>
                <CardDescription className="text-gray-600">
                  Add your shipping or business address (optional)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 px-6 py-4 sm:px-10">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First name</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="border-gray-200 focus:border-rose-300 focus:ring focus:ring-rose-200 focus:ring-opacity-50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last name</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="border-gray-200 focus:border-rose-300 focus:ring focus:ring-rose-200 focus:ring-opacity-50"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address1">Address line 1</Label>
                  <Input
                    id="address1"
                    name="address1"
                    value={formData.address1}
                    onChange={handleInputChange}
                    placeholder="Street address, P.O. box"
                    className="border-gray-200 focus:border-rose-300 focus:ring focus:ring-rose-200 focus:ring-opacity-50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address2">Address line 2 (optional)</Label>
                  <Input
                    id="address2"
                    name="address2"
                    value={formData.address2}
                    onChange={handleInputChange}
                    placeholder="Apartment, suite, unit, building, floor, etc."
                    className="border-gray-200 focus:border-rose-300 focus:ring focus:ring-rose-200 focus:ring-opacity-50"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="border-gray-200 focus:border-rose-300 focus:ring focus:ring-rose-200 focus:ring-opacity-50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State / Province</Label>
                    <Input
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className="border-gray-200 focus:border-rose-300 focus:ring focus:ring-rose-200 focus:ring-opacity-50"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="zipCode">ZIP / Postal code</Label>
                    <Input
                      id="zipCode"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      className="border-gray-200 focus:border-rose-300 focus:ring focus:ring-rose-200 focus:ring-opacity-50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className="border-gray-200 focus:border-rose-300 focus:ring focus:ring-rose-200 focus:ring-opacity-50"
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t border-gray-100 px-6 py-4 sm:px-10">
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  className="border-gray-200 text-gray-600 hover:bg-gray-50"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
                <div className="space-x-2">
                  <Button variant="ghost" onClick={handleSkip} className="text-gray-500 hover:bg-gray-50">
                    Skip for now
                  </Button>
                  <Button onClick={handleNext} className="bg-rose-500 text-white hover:bg-rose-600">
                    Complete Setup <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardFooter>
            </>
          )}
        </Card>
      </div>
    </div>
  )
}

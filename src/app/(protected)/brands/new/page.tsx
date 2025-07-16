'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

const brandSchema = z.object({
  name: z.string().min(1, 'Brand name is required'),
  website: z.string().url('Please enter a valid URL'),
  additionalInfo: z.string().optional(),
  targetAudience: z.string().optional(),
  brandTone: z.string().optional(),
  keyOffer: z.string().optional(),
  imageGuidelines: z.string().optional(),
})

type BrandFormData = z.infer<typeof brandSchema>

export default function NewBrandPage() {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [autofillLoading, setAutofillLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const form = useForm<BrandFormData>({
    resolver: zodResolver(brandSchema),
    defaultValues: {
      name: '',
      website: '',
      additionalInfo: '',
      targetAudience: '',
      brandTone: '',
      keyOffer: '',
      imageGuidelines: '',
    },
  })

  const { register, handleSubmit, formState: { errors }, watch, setValue } = form

  const handleAutofill = async () => {
    const name = watch('name')
    const website = watch('website')
    const additionalInfo = watch('additionalInfo')

    if (!name || !website) {
      alert('Please fill in brand name and website first')
      return
    }

    setAutofillLoading(true)
    try {
      const response = await fetch('/api/n8n', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          identifier: 'autofill',
          data: {
            brandId: 'temp-id',
            name,
            website,
            additionalInfo,
          },
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to autofill brand details')
      }

      const data = await response.json()
      setValue('targetAudience', data.targetAudience)
      setValue('brandTone', data.brandTone)
      setValue('keyOffer', data.keyOffer)
    } catch (error) {
      console.error('Autofill error:', error)
      alert('Failed to autofill brand details. Please try again.')
    } finally {
      setAutofillLoading(false)
    }
  }

  const onSubmit = async (data: BrandFormData) => {
    setLoading(true)
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      
      if (authError) {
        console.error('Auth error:', authError)
        throw new Error('Authentication failed: ' + authError.message)
      }
      
      if (!user) {
        throw new Error('User not authenticated')
      }

      console.log('Creating brand for user:', user.id)
      console.log('Brand data:', data)

      const { data: insertData, error } = await supabase
        .from('brands')
        .insert([
          {
            user_id: user.id,
            name: data.name,
            website: data.website,
            additional_info: data.additionalInfo,
            target_audience: data.targetAudience,
            brand_tone: data.brandTone,
            key_offer: data.keyOffer,
            image_guidelines: data.imageGuidelines,
          },
        ])
        .select()

      if (error) {
        console.error('Database error:', error)
        throw new Error(`Database error: ${error.message}`)
      }

      console.log('Brand created successfully:', insertData)
      
      // Get the created brand ID
      const newBrand = insertData[0]
      if (newBrand?.id) {
        console.log('Automatically generating content angles for brand:', newBrand.id)
        // Redirect to strategy page with auto-trigger parameter
        router.push(`/brands/${newBrand.id}/strategy?auto=true`)
      } else {
        router.push('/dashboard')
      }
    } catch (error) {
      console.error('Error creating brand:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      alert(`Failed to create brand: ${errorMessage}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => router.push('/dashboard')}
            className="mb-4"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          
          <div className="flex items-center gap-4 mb-6">
            <Badge variant={step === 1 ? "default" : "secondary"}>1</Badge>
            <span className="text-sm text-gray-600">Basic Info</span>
            <div className="flex-1 h-px bg-gray-200"></div>
            <Badge variant={step === 2 ? "default" : "secondary"}>2</Badge>
            <span className="text-sm text-gray-600">Brand Details</span>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>
              {step === 1 ? 'Basic Information' : 'Brand Details'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {step === 1 && (
                <>
                  <div>
                    <Label htmlFor="name">Brand Name</Label>
                    <Input
                      id="name"
                      {...register('name')}
                      placeholder="Enter brand name"
                    />
                    {errors.name && (
                      <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      {...register('website')}
                      placeholder="https://example.com"
                    />
                    {errors.website && (
                      <p className="text-sm text-red-600 mt-1">{errors.website.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="additionalInfo">Additional Context (Optional)</Label>
                    <Textarea
                      id="additionalInfo"
                      {...register('additionalInfo')}
                      placeholder="Describe your brand's background, mission, unique aspects, or any specific context that would help generate better content strategies..."
                      rows={3}
                    />
                  </div>

                  <div className="flex justify-end">
                    <Button
                      type="button"
                      onClick={() => setStep(2)}
                      disabled={!watch('name') || !watch('website')}
                    >
                      Next
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </>
              )}

              {step === 2 && (
                <>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Brand Strategy</h3>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleAutofill}
                      disabled={autofillLoading}
                    >
                      <Sparkles className="w-4 h-4 mr-2" />
                      {autofillLoading ? 'Autofilling...' : 'Autofill'}
                    </Button>
                  </div>

                  <div>
                    <Label htmlFor="targetAudience">Target Audience</Label>
                    <Textarea
                      id="targetAudience"
                      {...register('targetAudience')}
                      placeholder="Describe your ideal customers - their demographics, interests, pain points, and behaviors..."
                      rows={2}
                    />
                  </div>

                  <div>
                    <Label htmlFor="brandTone">Brand Tone</Label>
                    <Textarea
                      id="brandTone"
                      {...register('brandTone')}
                      placeholder="Describe your brand's personality and communication style - formal, casual, friendly, authoritative, playful, etc..."
                      rows={2}
                    />
                  </div>

                  <div>
                    <Label htmlFor="keyOffer">Key Offer</Label>
                    <Textarea
                      id="keyOffer"
                      {...register('keyOffer')}
                      placeholder="What unique value do you provide? What problems do you solve? What makes you different from competitors?"
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="imageGuidelines">Image Guidelines (Optional)</Label>
                    <Textarea
                      id="imageGuidelines"
                      {...register('imageGuidelines')}
                      placeholder="Describe your visual style preferences - colors, mood, photography style, graphic elements, what to avoid..."
                      rows={2}
                    />
                  </div>

                  <div className="flex justify-between">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setStep(1)}
                    >
                      <ChevronLeft className="w-4 h-4 mr-2" />
                      Back
                    </Button>
                    <Button type="submit" disabled={loading}>
                      {loading ? 'Creating Brand...' : 'Create Brand'}
                    </Button>
                  </div>
                </>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
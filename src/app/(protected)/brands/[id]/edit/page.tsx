'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ChevronLeft, ChevronRight, Sparkles, Save } from 'lucide-react'
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

interface Props {
  params: Promise<{ id: string }>
}

export default function EditBrandPage({ params: paramsPromise }: Props) {
  const [params, setParams] = useState<{ id: string } | null>(null)
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [autofillLoading, setAutofillLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
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

  // Resolve params
  useEffect(() => {
    paramsPromise.then(setParams)
  }, [paramsPromise])

  // Load brand data
  useEffect(() => {
    if (!params?.id) return

    const loadBrand = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          router.push('/login')
          return
        }

        const { data: brand, error } = await supabase
          .from('brands')
          .select('*')
          .eq('id', params.id)
          .eq('user_id', user.id)
          .single()

        if (error || !brand) {
          router.push('/dashboard')
          return
        }

        // Populate form with existing brand data
        setValue('name', brand.name)
        setValue('website', brand.website)
        setValue('additionalInfo', brand.additional_info || '')
        setValue('targetAudience', brand.target_audience || '')
        setValue('brandTone', brand.brand_tone || '')
        setValue('keyOffer', brand.key_offer || '')
        setValue('imageGuidelines', brand.image_guidelines || '')
      } catch (error) {
        console.error('Error loading brand:', error)
        router.push('/dashboard')
      } finally {
        setInitialLoading(false)
      }
    }

    loadBrand()
  }, [params?.id, supabase, router, setValue])

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
            brandId: params?.id,
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
    if (!params?.id) return

    setLoading(true)
    try {
      const { error } = await supabase
        .from('brands')
        .update({
          name: data.name,
          website: data.website,
          additional_info: data.additionalInfo,
          target_audience: data.targetAudience,
          brand_tone: data.brandTone,
          key_offer: data.keyOffer,
          image_guidelines: data.imageGuidelines,
          updated_at: new Date().toISOString(),
        })
        .eq('id', params.id)

      if (error) {
        throw new Error(`Database error: ${error.message}`)
      }

      router.push('/dashboard')
    } catch (error) {
      console.error('Error updating brand:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      alert(`Failed to update brand: ${errorMessage}`)
    } finally {
      setLoading(false)
    }
  }

  if (initialLoading) {
    return (
      <div className="min-h-screen main-content flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading brand details...</p>
        </div>
      </div>
    )
  }

  if (!params?.id) {
    return null
  }

  return (
    <div className="min-h-screen main-content">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="content-header">
          <div>
            <Button 
              variant="ghost" 
              onClick={() => router.push('/dashboard')}
              className="mb-4"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            
            <h1 className="content-title">Edit Brand</h1>
            <p className="content-subtitle">Update your brand information and strategy</p>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-center gap-4">
            <Badge variant={step === 1 ? "default" : "secondary"}>1</Badge>
            <span className="text-sm text-gray-600">Basic Info</span>
            <div className="flex-1 h-px bg-gray-200"></div>
            <Badge variant={step === 2 ? "default" : "secondary"}>2</Badge>
            <span className="text-sm text-gray-600">Brand Details</span>
          </div>
        </div>

        <Card className="detail-panel">
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
                      <Save className="w-4 h-4 mr-2" />
                      {loading ? 'Saving Changes...' : 'Save Changes'}
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
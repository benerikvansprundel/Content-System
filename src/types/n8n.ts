export interface N8nAutofillRequest {
  identifier: 'autofill'
  data: {
    brandId: string
    name: string
    website: string
    additionalInfo?: string
  }
}

export interface N8nAutofillResponse {
  targetAudience: string
  brandTone: string
  keyOffer: string
}

export interface N8nGenerateAnglesRequest {
  identifier: 'generateAngles'
  data: {
    brandId: string
    name: string
    website: string
    targetAudience: string
    brandTone: string
    keyOffer: string
    imageGuidelines?: string
  }
}

export interface N8nGenerateAnglesResponse {
  angles: {
    header: string
    description: string
    tonality: string
    objective: string
  }[]
}

export interface N8nGenerateIdeasRequest {
  identifier: 'generateIdeas'
  data: {
    angleId: string
    platform: 'twitter' | 'linkedin' | 'newsletter'
    selectedAngle: {
      header: string
      description: string
      tonality: string
      objective: string
    }
    brandData: {
      name: string
      website: string
      targetAudience: string
      brandTone: string
      keyOffer: string
      imageGuidelines?: string
    }
  }
}

export interface N8nGenerateIdeasResponse {
  ideas: {
    topic: string
    description: string
    imagePrompt: string
  }[]
}

export interface N8nGenerateContentRequest {
  identifier: 'generateContent'
  data: {
    ideaId: string
    platform: 'twitter' | 'linkedin' | 'newsletter'
    contentIdea: {
      topic: string
      description: string
      imagePrompt: string
    }
    brandData: {
      name: string
      website: string
      targetAudience: string
      brandTone: string
      keyOffer: string
      imageGuidelines?: string
    }
    selectedAngle: {
      header: string
      description: string
      tonality: string
      objective: string
    }
  }
}

export interface N8nGenerateContentResponse {
  content: string
  imageUrl: string
}

export type N8nRequest = 
  | N8nAutofillRequest 
  | N8nGenerateAnglesRequest 
  | N8nGenerateIdeasRequest 
  | N8nGenerateContentRequest

export type N8nResponse = 
  | N8nAutofillResponse 
  | N8nGenerateAnglesResponse 
  | N8nGenerateIdeasResponse 
  | N8nGenerateContentResponse
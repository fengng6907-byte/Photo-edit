import { fal } from "@fal-ai/client";

fal.config({ credentials: process.env.FAL_KEY });

export const STYLE_PROMPTS = {
  fujifilm: {
    positive:
      "fujifilm XT4, analog film photography, natural film grain, warm golden tones, lifted shadows, soft highlights, cinematic depth of field, 35mm photography, velvia color, organic texture, timeless",
    negative:
      "digital, HDR, oversaturated, plastic, synthetic, AI-generated look, harsh shadows",
  },
  ccd: {
    positive:
      "CCD digital camera, early 2000s digital photography, Y2K aesthetic, saturated colors, digital sensor noise, slightly overexposed, nostalgic, Casio Exilim, point-and-shoot, retro digital",
    negative:
      "film grain, analog, modern, clean, sharp, DSLR, professional",
  },
} as const;

export type StyleKey = keyof typeof STYLE_PROMPTS;

export interface TransformResult {
  imageUrl: string;
  requestId: string;
}

export async function transformImage(
  imageUrl: string,
  style: StyleKey
): Promise<TransformResult> {
  const prompts = STYLE_PROMPTS[style];

  const result = await fal.run("fal-ai/fast-sdxl/image-to-image", {
    input: {
      image_url: imageUrl,
      prompt: prompts.positive,
      negative_prompt: prompts.negative,
      strength: 0.55,
      num_inference_steps: 25,
      guidance_scale: 7.5,
      image_size: "square_hd",
    },
  });

  const output = result as { images?: Array<{ url: string }>; request_id?: string };
  const imageResult = output.images?.[0];
  if (!imageResult?.url) {
    throw new Error("No image returned from Fal.ai");
  }

  return {
    imageUrl: imageResult.url,
    requestId: output.request_id ?? "",
  };
}

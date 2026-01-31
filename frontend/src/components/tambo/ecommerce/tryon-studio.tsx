"use client";

import { z } from "zod";
import { useState } from "react";
import Image from "next/image";
import { Upload, Wand2, Camera, AlertCircle } from "lucide-react";

// Helper to validate and provide fallback for image URLs
const getValidImageUrl = (url: string): string => {
  if (!url || url === "https://" || url === "http://" || url.length < 15) {
    return "https://picsum.photos/seed/tryon/300/300";
  }
  if (url.includes('unsplash.com') && url.length < 50) {
    return "https://picsum.photos/seed/tryon/300/300";
  }
  if (url.match(/\.(com|org|net|io)\/?$/)) {
    return "https://picsum.photos/seed/tryon/300/300";
  }
  try {
    const parsed = new URL(url);
    if (parsed.pathname === '/' || parsed.pathname === '') {
      return "https://picsum.photos/seed/tryon/300/300";
    }
    return url;
  } catch {
    return "https://picsum.photos/seed/tryon/300/300";
  }
};

export const tryonStudioSchema = z.object({
  product: z.object({
    id: z.string().default(""),
    name: z.string().default("Product"),
    image: z.string().default("https://picsum.photos/seed/tryon/300/300"),
    category: z.string().default("Apparel"),
  }),
  tryonResultUrl: z.string().optional(),
  tips: z.array(z.string()).optional(),
});

type TryOnStudioProps = z.infer<typeof tryonStudioSchema>;

export function TryOnStudio({
  product,
  tryonResultUrl,
  tips = [
    "Face the camera directly",
    "Ensure good lighting",
    "Stand against a plain background",
    "Wear minimal accessories",
  ],
}: TryOnStudioProps) {
  const [userImage, setUserImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<string | null>(tryonResultUrl || null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUserImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerateTryOn = () => {
    setIsGenerating(true);
    // Simulate AI processing
    setTimeout(() => {
      setResult(
        tryonResultUrl ||
          "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400"
      );
      setIsGenerating(false);
    }, 3000);
  };

  return (
    <div className="w-full max-w-5xl mx-auto bg-white rounded-lg shadow-lg p-8 space-y-6">
      <div className="flex items-center gap-3">
        <Wand2 className="w-8 h-8 text-purple-600" />
        <h2 className="text-2xl font-bold text-gray-900">
          Virtual Try-On Studio
        </h2>
      </div>

      {/* Product Info */}
      <div className="bg-purple-50 rounded-lg p-4 flex items-center gap-4">
        <div className="relative w-20 h-20">
          <Image
            src={getValidImageUrl(product.image)}
            alt={product.name}
            fill
            className="object-cover rounded-lg"
          />
        </div>
        <div>
          <p className="font-semibold text-gray-900">{product.name}</p>
          <p className="text-sm text-gray-600">{product.category}</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Upload Section */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg text-gray-900">
            1. Upload Your Photo
          </h3>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center space-y-4 hover:border-purple-500 transition-colors">
            {userImage ? (
              <div className="relative w-full h-64">
                <Image
                  src={userImage}
                  alt="Your photo"
                  fill
                  className="object-contain"
                />
              </div>
            ) : (
              <>
                <Camera className="w-16 h-16 text-gray-400 mx-auto" />
                <p className="text-gray-600">Upload your photo</p>
              </>
            )}
            <label className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 cursor-pointer">
              <Upload className="w-4 h-4" />
              Choose Photo
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          </div>

          {/* Tips */}
          <div className="bg-blue-50 rounded-lg p-4 space-y-2">
            <div className="flex items-center gap-2 text-blue-800">
              <AlertCircle className="w-5 h-5" />
              <p className="font-semibold">Pro Tips</p>
            </div>
            <ul className="space-y-1 text-sm text-blue-700">
              {tips.map((tip, idx) => (
                <li key={idx}>✓ {tip}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Result Section */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg text-gray-900">
            2. See Yourself in It
          </h3>
          <div className="border-2 border-gray-300 rounded-lg p-8 bg-gray-50 min-h-[400px] flex items-center justify-center">
            {isGenerating ? (
              <div className="text-center space-y-4">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-600 border-t-transparent mx-auto"></div>
                <p className="text-gray-600">Generating your try-on...</p>
              </div>
            ) : result ? (
              <div className="relative w-full h-96">
                <Image
                  src={result}
                  alt="Try-on result"
                  fill
                  className="object-contain"
                />
              </div>
            ) : (
              <p className="text-gray-400">
                Your try-on result will appear here
              </p>
            )}
          </div>

          <button
            onClick={handleGenerateTryOn}
            disabled={!userImage || isGenerating}
            className="w-full py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            <Wand2 className="w-5 h-5" />
            {isGenerating ? "Generating..." : "Generate Try-On"}
          </button>
        </div>
      </div>
    </div>
  );
}

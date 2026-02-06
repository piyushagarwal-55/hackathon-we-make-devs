"use client";

import React, { useState, useRef } from "react";
import { Upload, Camera, Loader2, CheckCircle2, XCircle } from "lucide-react";
import Image from "next/image";

export interface VirtualTryOnProps {
  productId?: string;
  productName?: string;
  productImage?: string;
}

export function VirtualTryOnUploader({
  productId = "",
  productName = "Product",
  productImage = "",
}: VirtualTryOnProps) {
  const [userImage, setUserImage] = useState<string | null>(null);
  const [userImageFile, setUserImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log("📸 File input triggered", event);
    const file = event.target.files?.[0];
    console.log("📁 Selected file:", file);
    
    if (file) {
      if (!file.type.startsWith("image/")) {
        console.error("❌ Invalid file type:", file.type);
        setError("Please select an image file");
        return;
      }
      
      console.log("✅ Valid image file:", file.name, file.type, file.size, "bytes");

      // Create preview
      console.log("📖 Reading file...");
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        console.log("✅ File loaded, size:", dataUrl.length, "chars");
        setUserImage(dataUrl);
        setUserImageFile(file);
        setError(null);
        setResultImage(null);
      };
      reader.onerror = (e) => {
        console.error("❌ FileReader error:", e);
        setError("Failed to read image file");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTryOn = async () => {
    console.log("🎬 Try-on button clicked");
    console.log("📦 Product ID:", productId);
    console.log("📸 User image file:", userImageFile);
    
    if (!userImageFile) {
      console.error("❌ No user image");
      setError("Please upload your photo first");
      return;
    }

    if (!productId) {
      console.error("❌ No product ID");
      setError("No product selected. Please select a product from the chat first.");
      return;
    }

    console.log("✅ Starting try-on process...");
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("user_image", userImageFile);
      formData.append("product_id", productId);

      const response = await fetch("http://localhost:8000/virtual-tryon", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Virtual try-on failed");
      }

      const data = await response.json();
      
      if (data.status === "success" && data.result_image) {
        // result_image is base64 encoded
        const imageUrl = `data:image/png;base64,${data.result_image}`;
        setResultImage(imageUrl);
      } else {
        throw new Error(data.message || "Failed to generate try-on image");
      }
    } catch (err: any) {
      console.error("Try-on error:", err);
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setUserImage(null);
    setUserImageFile(null);
    setResultImage(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="w-full bg-card rounded-lg border border-border shadow-lg">
      <div className="p-6 border-b border-border">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          <Camera className="w-6 h-6" />
          Virtual Try-On: {productName}
        </h2>
        <p className="text-sm text-gray-600 mt-2">
          Upload your photo to see how this product looks on you
        </p>
      </div>
      <div className="p-6 space-y-6">
        {/* No product warning */}
        {!productId && (
          <div className="flex items-center gap-2 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <XCircle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
            <p className="text-sm text-yellow-700">
              No product selected. Ask me about a specific product first (e.g., "show me sunglasses"), then say "I want to try this on".
            </p>
          </div>
        )}

        {/* Product Preview */}
        {productImage && (
          <div className="flex flex-col items-center gap-3">
          <p className="text-sm text-gray-600 font-medium">Product</p>
          <div className="relative w-32 h-32 rounded-lg overflow-hidden border-2 border-gray-200">
            <Image
              src={productImage}
              alt={productName}
              fill
              className="object-cover"
            />
          </div>
        </div>
        )}

        {/* Upload Section */}
        {!resultImage && (
          <div className="space-y-4">
            <div className="flex flex-col items-center gap-4 p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 transition-colors">
              {userImage ? (
                <div className="relative w-full max-w-sm aspect-square rounded-lg overflow-hidden">
                    <div className="absolute top-0 left-0 w-full bg-yellow-500/90 text-black text-xs font-semibold text-center py-1 z-10">
    🚧 Virtual Try-On is under testing — results may be inaccurate
  </div>
                  <Image
                    src={userImage}
                    alt="Your photo"
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3 py-8">
                  <Upload className="w-12 h-12 text-gray-400" />
                  <p className="text-sm text-gray-600 text-center">
                    Click below to upload your photo
                  </p>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer flex items-center gap-2 bg-white"
              >
                <Upload className="w-4 h-4" />
                {userImage ? "Change Photo" : "Upload Photo"}
              </label>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {userImage && (
              <div className="flex gap-3">
                <button
                  onClick={handleTryOn}
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Camera className="w-4 h-4" />
                      Try It On
                    </>
                  )}
                </button>
                <button
                  onClick={handleReset}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Reset
                </button>
              </div>
            )}
          </div>
        )}

        {/* Result Section */}
        {resultImage && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
              <p className="text-sm text-green-700 font-medium">
                Try-on complete! Here's how it looks:
              </p>
            </div>

            <div className="relative w-full aspect-square rounded-lg overflow-hidden border-2 border-green-300 shadow-lg">
              <Image
                src={resultImage}
                alt="Virtual try-on result"
                fill
                className="object-cover"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleReset}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Try Another Photo
              </button>
              <button
                onClick={() => {
                  const link = document.createElement("a");
                  link.href = resultImage;
                  link.download = `tryon-${productName}-${Date.now()}.png`;
                  link.click();
                }}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Download Result
              </button>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center gap-3 py-8">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
            <p className="text-sm text-gray-600 animate-pulse">
              Creating your virtual try-on...
            </p>
            <p className="text-xs text-gray-500">
              This may take 10-30 seconds
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// Zod schema for props validation
import { z } from "zod";

export const virtualTryOnSchema = z.object({
  productId: z.string().optional().default("").describe("The unique ID of the product to try on"),
  productName: z.string().optional().default("Product").describe("The name of the product"),
  productImage: z.string().optional().default("").describe("URL of the product image"),
});

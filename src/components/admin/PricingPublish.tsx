import React, { useState } from "react";
import { UploadCloud, Video } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PricingPublishProps {
  price: number;
  onPriceChange?: (price: number) => void;
}

const PricingPublish: React.FC<PricingPublishProps> = ({ price: initialPrice, onPriceChange }) => {
  const [price, setPrice] = useState<string>(initialPrice.toString());
  const [promoVideo, setPromoVideo] = useState<string | null>(null);

  const handlePriceChange = (value: string) => {
    setPrice(value);
    if (onPriceChange) {
      onPriceChange(parseFloat(value) || 0);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-lg border border-border p-4 bg-card">
          <label className="block text-sm font-medium mb-2">Course Price (USD)</label>
          <input value={price} onChange={(e) => handlePriceChange(e.target.value)} className="w-full rounded-lg border border-border p-3 bg-transparent" />
          <p className="text-xs text-muted-foreground mt-2">Set a price or mark as free.</p>
        </div>

        <div className="rounded-lg border border-border p-4 bg-card">
          <label className="block text-sm font-medium mb-2">Promotional Video</label>
          <div className="flex items-center gap-3">
            <div className="w-28 h-20 bg-secondary rounded-md flex items-center justify-center">
              {promoVideo ? <video src={promoVideo} className="w-full h-full object-cover" /> : <Video className="w-6 h-6 text-muted-foreground" />}
            </div>
            <div>
              <input type="file" accept="video/*" hidden id="promo" onChange={(e) => { const f = e.target.files?.[0]; if (f) setPromoVideo(URL.createObjectURL(f)); }} />
              <label htmlFor="promo" className="px-3 py-2 rounded-lg bg-primary text-primary-foreground inline-flex items-center gap-2 cursor-pointer"><UploadCloud className="w-4 h-4" /> Upload Promo</label>
              <div className="text-xs text-muted-foreground mt-2">Use a 30–90s promotional video to attract students.</div>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-border p-4 bg-card">
        <h4 className="font-medium">Landing Page Preview</h4>
        <p className="text-sm text-muted-foreground mt-2">Quick preview of how your price and promo assets will appear on the course page.</p>
        <div className="mt-3 flex items-center justify-between">
          <div>
            <div className="text-lg font-semibold">${price}</div>
            <div className="text-sm text-muted-foreground">Billed once</div>
          </div>
          <div>
            <Button variant="ghost">Preview Landing Page</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPublish;

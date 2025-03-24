import React, { useState, useEffect } from 'react';
import { ShieldCheck, Users } from 'lucide-react';
import { supabase } from '../../lib/supabase';

/**
 * Header component for the Hair Growth page
 */
const Header: React.FC = () => {
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  // Fetch logo from Supabase
  useEffect(() => {
    const fetchLogo = async () => {
      const { data: { publicUrl } } = supabase
        .storage
        .from('bolt')
        .getPublicUrl('logo_eles.webp');
      
      if (publicUrl) {
        setLogoUrl(publicUrl);
      }
    };

    fetchLogo();
  }, []);

  return (
    <header className="sticky top-0 bg-white z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="h-8">
          {logoUrl ? (
            <img src={logoUrl} alt="eles" className="h-full w-auto" />
          ) : (
            <div className="text-2xl font-bold text-gray-800">[e]eles</div>
          )}
        </div>
        <div className="flex items-center gap-4">
          <button className="hover:text-gray-600">
            <ShieldCheck className="w-5 h-5" />
          </button>
          <button className="hover:text-gray-600">
            <Users className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
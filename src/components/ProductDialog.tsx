import React, { useState, useEffect, useRef } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './ui/alert-dialog';
import { Button } from './ui/button';
import { X } from 'lucide-react';

interface ProductDialogProps {
  product: {
    id?: string;
    name: string;
    tag: string;
    imageUrl: string;
    description?: string;
    imageAlt?: string;
    title?: string;
  };
}

export function ProductDialog({ product }: ProductDialogProps) {
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<any>(null);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (open && dialogRef.current && !dialogRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);
  
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-6 bottom-6 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-all"
          aria-label={`Ver detalhes de ${product.name}`}
          onClick={() => setOpen(true)}
        >
          <span className="text-xl font-light">+</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent
        ref={dialogRef}
        className="max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 p-0 overflow-hidden rounded-xl"
      >
        {/* Coluna da esquerda - Imagem do produto */}
        <div className="bg-gray-50 flex items-center justify-center p-0 min-h-[400px]">
          <img
            src={product.imageUrl}
            alt={product.imageAlt || product.name}
            className="w-full h-full object-contain p-8"
          />
        </div>
        
        {/* Coluna da direita - Informações do produto */}
        <div className="p-8 flex flex-col">
          <AlertDialogHeader className="text-left mb-6">
            <div className="flex justify-between items-start mb-4">
              <AlertDialogTitle className="text-3xl font-bold">{product.name}</AlertDialogTitle>
              <AlertDialogCancel className="rounded-full w-10 h-10 p-0 flex items-center justify-center -mt-2 -mr-2 hover:bg-gray-100">
                <X className="h-5 w-5" />
              </AlertDialogCancel>
            </div>
            <div className="flex items-center gap-2 mt-3">
              <span className="text-sm font-medium text-gray-500 uppercase tracking-wider bg-gray-100 px-3 py-1.5 rounded-full">
                {product.tag}
              </span>
            </div>
          </AlertDialogHeader>
          
          {product.description && (
            <AlertDialogDescription className="text-lg text-gray-700 mt-6 mb-8 flex-grow leading-relaxed">
              {product.description}
            </AlertDialogDescription>
          )}
          
          <AlertDialogFooter className="mt-auto pb-0">
            <AlertDialogAction className="w-full bg-[#8A3A34] hover:bg-[#8A3A34]/90 py-4 text-lg font-medium">
              Iniciar Tratamento
            </AlertDialogAction>
          </AlertDialogFooter>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
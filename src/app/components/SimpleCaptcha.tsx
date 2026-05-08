import { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';

interface SimpleCaptchaProps {
  isCaptchaValid: boolean;
  setIsCaptchaValid: (isValid: boolean) => void;
}

export function SimpleCaptcha({ isCaptchaValid, setIsCaptchaValid }: SimpleCaptchaProps) {
  const [captchaText, setCaptchaText] = useState('');
  const [userInput, setUserInput] = useState('');

  const generateCaptcha = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let text = '';
    for (let i = 0; i < 6; i++) {
      text += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaText(text);
    setUserInput('');
    setIsCaptchaValid(false);
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  useEffect(() => {
    if (userInput.length === 6) {
      const valid = userInput.toUpperCase() === captchaText;
      setIsCaptchaValid(valid);
    } else {
      setIsCaptchaValid(false);
    }
  }, [userInput, captchaText, setIsCaptchaValid]);

  return (
    <div className="space-y-3">
      <Label>Verificación de Seguridad</Label>
      <div className="flex items-center gap-3">
        <div className="flex-1 bg-gradient-to-r from-sky-100 to-blue-100 border-2 border-sky-300 rounded-lg p-4 select-none relative overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,.1) 10px, rgba(0,0,0,.1) 20px)'
          }} />
          <p className="text-3xl font-bold tracking-widest text-sky-700 text-center relative z-10" style={{
            fontFamily: 'monospace',
            textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
            letterSpacing: '8px',
            transform: 'skewX(-5deg)'
          }}>
            {captchaText}
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={generateCaptcha}
          className="border-sky-300 hover:bg-sky-50"
          title="Generar nuevo captcha"
        >
          <RefreshCw className="text-sky-600" size={20} />
        </Button>
      </div>
      <div className="space-y-2">
        <Input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value.toUpperCase())}
          placeholder="Ingresa el código de arriba"
          maxLength={6}
          className={`border-sky-200 text-center text-lg tracking-widest ${
            isCaptchaValid
              ? 'border-green-500 bg-green-50'
              : !isCaptchaValid && userInput.length === 6
              ? 'border-red-500 bg-red-50'
              : ''
          }`}
        />
        {isCaptchaValid && (
          <p className="text-sm text-green-600 flex items-center gap-1">
            ✓ Código verificado correctamente
          </p>
        )}
        {!isCaptchaValid && userInput.length === 6 && (
          <p className="text-sm text-red-600 flex items-center gap-1">
            ✗ Código incorrecto. Intenta nuevamente
          </p>
        )}
      </div>
    </div>
  );
}
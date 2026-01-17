"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button, Input, Card } from "@/shared/ui";
import { cn } from "@/shared/lib";
import {
  Save,
  Store,
  Mail,
  Phone,
  MapPin,
  Truck,
  CreditCard,
  Globe,
  Bell,
  Palette,
  Upload,
  Check,
  AlertTriangle,
  Loader2,
} from "lucide-react";

// Tab configuration
const tabs = [
  { id: "general", label: "General", icon: Store },
  { id: "contact", label: "Contacto", icon: Phone },
  { id: "shipping", label: "Envíos", icon: Truck },
  { id: "payments", label: "Pagos", icon: CreditCard },
  { id: "seo", label: "SEO", icon: Globe },
  { id: "notifications", label: "Notificaciones", icon: Bell },
];

interface Settings {
  // General
  storeName: string;
  storeDescription: string;
  storeLogo: string;
  currency: string;
  language: string;

  // Contact
  email: string;
  phone: string;
  whatsapp: string;
  address: string;
  city: string;
  country: string;

  // Shipping
  freeShippingThreshold: number;
  standardShippingCost: number;
  expressShippingCost: number;
  shippingZones: string[];

  // Payments
  bankTransferEnabled: boolean;
  bankName: string;
  bankAccount: string;
  yapeEnabled: boolean;
  yapeNumber: string;
  cashOnDeliveryEnabled: boolean;

  // SEO
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  googleAnalyticsId: string;
  facebookPixelId: string;

  // Notifications
  orderNotifications: boolean;
  stockAlertNotifications: boolean;
  stockAlertThreshold: number;
  newsletterEnabled: boolean;
}

const defaultSettings: Settings = {
  // General
  storeName: "Biuty",
  storeDescription: "Tienda de productos naturales y fitness",
  storeLogo: "",
  currency: "PEN",
  language: "es",

  // Contact
  email: "",
  phone: "",
  whatsapp: "",
  address: "",
  city: "",
  country: "Perú",

  // Shipping
  freeShippingThreshold: 100,
  standardShippingCost: 15,
  expressShippingCost: 25,
  shippingZones: ["Lima", "Provincias"],

  // Payments
  bankTransferEnabled: true,
  bankName: "",
  bankAccount: "",
  yapeEnabled: true,
  yapeNumber: "",
  cashOnDeliveryEnabled: false,

  // SEO
  metaTitle: "Biuty - Productos Naturales & Fitness",
  metaDescription: "Tu tienda de confianza para productos de bienestar, suplementos deportivos y alimentos naturales.",
  metaKeywords: "suplementos, fitness, natural, bienestar, miel, algarrobina",
  googleAnalyticsId: "",
  facebookPixelId: "",

  // Notifications
  orderNotifications: true,
  stockAlertNotifications: true,
  stockAlertThreshold: 10,
  newsletterEnabled: true,
};

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general");
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load settings from localStorage on mount (in production, this would come from Firestore)
  useEffect(() => {
    const saved = localStorage.getItem("biuty_settings");
    if (saved) {
      setSettings({ ...defaultSettings, ...JSON.parse(saved) });
    }
  }, []);

  const handleChange = (field: keyof Settings, value: string | number | boolean | string[]) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
    setSaveSuccess(false);
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);
    setSaveSuccess(false);

    try {
      // In production, save to Firestore
      // For now, save to localStorage
      localStorage.setItem("biuty_settings", JSON.stringify(settings));

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      setError("Error al guardar la configuración");
    } finally {
      setIsSaving(false);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "general":
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre de la Tienda
              </label>
              <Input
                value={settings.storeName}
                onChange={(e) => handleChange("storeName", e.target.value)}
                placeholder="Nombre de tu tienda"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descripción
              </label>
              <textarea
                value={settings.storeDescription}
                onChange={(e) => handleChange("storeDescription", e.target.value)}
                placeholder="Breve descripción de tu tienda"
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-sage/20 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Logo de la Tienda
              </label>
              <div className="flex items-center gap-4">
                {settings.storeLogo ? (
                  <div className="relative w-20 h-20 bg-gray-100 rounded-lg overflow-hidden">
                    <Image
                      src={settings.storeLogo}
                      alt="Logo"
                      fill
                      className="object-contain"
                    />
                  </div>
                ) : (
                  <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Store className="w-8 h-8 text-gray-400" />
                  </div>
                )}
                <label className="cursor-pointer">
                  <Button variant="outline" type="button">
                    <Upload className="w-4 h-4 mr-2" />
                    Subir Logo
                  </Button>
                  <input type="file" accept="image/*" className="hidden" />
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Moneda
                </label>
                <select
                  value={settings.currency}
                  onChange={(e) => handleChange("currency", e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-sage/20 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-white"
                >
                  <option value="PEN">Soles (S/)</option>
                  <option value="USD">Dólares ($)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Idioma
                </label>
                <select
                  value={settings.language}
                  onChange={(e) => handleChange("language", e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-sage/20 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-white"
                >
                  <option value="es">Español</option>
                  <option value="en">English</option>
                </select>
              </div>
            </div>
          </div>
        );

      case "contact":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email de Contacto
                </label>
                <Input
                  type="email"
                  value={settings.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  placeholder="contacto@tutienda.com"
                  leftIcon={<Mail className="w-4 h-4" />}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Teléfono
                </label>
                <Input
                  value={settings.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  placeholder="+51 999 999 999"
                  leftIcon={<Phone className="w-4 h-4" />}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                WhatsApp
              </label>
              <Input
                value={settings.whatsapp}
                onChange={(e) => handleChange("whatsapp", e.target.value)}
                placeholder="+51 999 999 999"
              />
              <p className="mt-1 text-xs text-gray-500">
                Número para el botón de WhatsApp en la tienda
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Dirección
              </label>
              <Input
                value={settings.address}
                onChange={(e) => handleChange("address", e.target.value)}
                placeholder="Av. Principal 123"
                leftIcon={<MapPin className="w-4 h-4" />}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ciudad
                </label>
                <Input
                  value={settings.city}
                  onChange={(e) => handleChange("city", e.target.value)}
                  placeholder="Lima"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  País
                </label>
                <Input
                  value={settings.country}
                  onChange={(e) => handleChange("country", e.target.value)}
                  placeholder="Perú"
                />
              </div>
            </div>
          </div>
        );

      case "shipping":
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Envío Gratis desde (S/)
              </label>
              <Input
                type="number"
                value={settings.freeShippingThreshold}
                onChange={(e) =>
                  handleChange("freeShippingThreshold", Number(e.target.value))
                }
                placeholder="100"
              />
              <p className="mt-1 text-xs text-gray-500">
                Monto mínimo de compra para envío gratuito
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Costo de Envío Estándar (S/)
                </label>
                <Input
                  type="number"
                  value={settings.standardShippingCost}
                  onChange={(e) =>
                    handleChange("standardShippingCost", Number(e.target.value))
                  }
                  placeholder="15"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Costo de Envío Express (S/)
                </label>
                <Input
                  type="number"
                  value={settings.expressShippingCost}
                  onChange={(e) =>
                    handleChange("expressShippingCost", Number(e.target.value))
                  }
                  placeholder="25"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Zonas de Envío
              </label>
              <div className="space-y-2">
                {settings.shippingZones.map((zone, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      value={zone}
                      onChange={(e) => {
                        const newZones = [...settings.shippingZones];
                        newZones[index] = e.target.value;
                        handleChange("shippingZones", newZones);
                      }}
                      placeholder="Zona de envío"
                      className="flex-1"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const newZones = settings.shippingZones.filter(
                          (_, i) => i !== index
                        );
                        handleChange("shippingZones", newZones);
                      }}
                    >
                      ×
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    handleChange("shippingZones", [...settings.shippingZones, ""])
                  }
                >
                  + Agregar Zona
                </Button>
              </div>
            </div>
          </div>
        );

      case "payments":
        return (
          <div className="space-y-6">
            {/* Bank Transfer */}
            <Card className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium">Transferencia Bancaria</h4>
                    <p className="text-sm text-gray-500">
                      Acepta pagos por transferencia
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.bankTransferEnabled}
                    onChange={(e) =>
                      handleChange("bankTransferEnabled", e.target.checked)
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
              {settings.bankTransferEnabled && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre del Banco
                    </label>
                    <Input
                      value={settings.bankName}
                      onChange={(e) => handleChange("bankName", e.target.value)}
                      placeholder="BCP, Interbank, etc."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Número de Cuenta
                    </label>
                    <Input
                      value={settings.bankAccount}
                      onChange={(e) =>
                        handleChange("bankAccount", e.target.value)
                      }
                      placeholder="000-000000000-0-00"
                    />
                  </div>
                </div>
              )}
            </Card>

            {/* Yape */}
            <Card className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Phone className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-medium">Yape</h4>
                    <p className="text-sm text-gray-500">
                      Acepta pagos con Yape
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.yapeEnabled}
                    onChange={(e) =>
                      handleChange("yapeEnabled", e.target.checked)
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
              {settings.yapeEnabled && (
                <div className="pt-4 border-t">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Número de Yape
                  </label>
                  <Input
                    value={settings.yapeNumber}
                    onChange={(e) => handleChange("yapeNumber", e.target.value)}
                    placeholder="+51 999 999 999"
                  />
                </div>
              )}
            </Card>

            {/* Cash on Delivery */}
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Truck className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-medium">Pago Contra Entrega</h4>
                    <p className="text-sm text-gray-500">
                      Pago al recibir el producto
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.cashOnDeliveryEnabled}
                    onChange={(e) =>
                      handleChange("cashOnDeliveryEnabled", e.target.checked)
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
            </Card>
          </div>
        );

      case "seo":
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Título SEO (Meta Title)
              </label>
              <Input
                value={settings.metaTitle}
                onChange={(e) => handleChange("metaTitle", e.target.value)}
                placeholder="Tu Tienda | Productos Naturales"
              />
              <p className="mt-1 text-xs text-gray-500">
                {settings.metaTitle.length}/60 caracteres recomendados
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descripción SEO (Meta Description)
              </label>
              <textarea
                value={settings.metaDescription}
                onChange={(e) =>
                  handleChange("metaDescription", e.target.value)
                }
                placeholder="Descripción para buscadores"
                rows={3}
                maxLength={160}
                className="w-full px-4 py-3 rounded-xl border border-sage/20 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              />
              <p className="mt-1 text-xs text-gray-500">
                {settings.metaDescription.length}/160 caracteres recomendados
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Palabras Clave (Keywords)
              </label>
              <Input
                value={settings.metaKeywords}
                onChange={(e) => handleChange("metaKeywords", e.target.value)}
                placeholder="suplementos, fitness, natural"
              />
              <p className="mt-1 text-xs text-gray-500">
                Separadas por comas
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Google Analytics ID
                </label>
                <Input
                  value={settings.googleAnalyticsId}
                  onChange={(e) =>
                    handleChange("googleAnalyticsId", e.target.value)
                  }
                  placeholder="G-XXXXXXXXXX"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Facebook Pixel ID
                </label>
                <Input
                  value={settings.facebookPixelId}
                  onChange={(e) =>
                    handleChange("facebookPixelId", e.target.value)
                  }
                  placeholder="000000000000000"
                />
              </div>
            </div>
          </div>
        );

      case "notifications":
        return (
          <div className="space-y-6">
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Notificaciones de Pedidos</h4>
                  <p className="text-sm text-gray-500">
                    Recibir email cuando llegue un nuevo pedido
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.orderNotifications}
                    onChange={(e) =>
                      handleChange("orderNotifications", e.target.checked)
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="font-medium">Alertas de Stock Bajo</h4>
                  <p className="text-sm text-gray-500">
                    Notificar cuando un producto tenga poco stock
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.stockAlertNotifications}
                    onChange={(e) =>
                      handleChange("stockAlertNotifications", e.target.checked)
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
              {settings.stockAlertNotifications && (
                <div className="pt-4 border-t">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Umbral de Stock Bajo
                  </label>
                  <Input
                    type="number"
                    value={settings.stockAlertThreshold}
                    onChange={(e) =>
                      handleChange("stockAlertThreshold", Number(e.target.value))
                    }
                    placeholder="10"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Notificar cuando el stock sea menor a este número
                  </p>
                </div>
              )}
            </Card>

            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Newsletter</h4>
                  <p className="text-sm text-gray-500">
                    Habilitar suscripción al newsletter
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.newsletterEnabled}
                    onChange={(e) =>
                      handleChange("newsletterEnabled", e.target.checked)
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Configuración</h1>
          <p className="text-gray-500">Administra la configuración de tu tienda</p>
        </div>
        <Button
          variant="primary"
          onClick={handleSave}
          disabled={isSaving}
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Guardando...
            </>
          ) : saveSuccess ? (
            <>
              <Check className="w-4 h-4 mr-2" />
              Guardado
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Guardar Cambios
            </>
          )}
        </Button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-2 text-red-700">
          <AlertTriangle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Tabs */}
        <Card className="lg:w-64 flex-shrink-0 bg-white p-2">
          <nav className="flex lg:flex-col gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors w-full text-left",
                  activeTab === tab.id
                    ? "bg-primary/10 text-primary"
                    : "text-gray-600 hover:bg-gray-50"
                )}
              >
                <tab.icon className="w-5 h-5" />
                <span className="hidden lg:inline">{tab.label}</span>
              </button>
            ))}
          </nav>
        </Card>

        {/* Tab Content */}
        <Card className="flex-1 bg-white p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            {tabs.find((t) => t.id === activeTab)?.label}
          </h2>
          {renderTabContent()}
        </Card>
      </div>
    </div>
  );
}

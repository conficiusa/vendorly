"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAddress } from "@/lib/swr/useAddresses";
import { Address, MobileMoneyProvider } from "@/prisma/generated/prisma-client";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import {
  MapPin,
  Loader2,
  CreditCard,
  Shield,
  CheckCircle,
  Plus,
  ArrowLeft,
  Phone,
} from "lucide-react";
import { useForm, UseFormReturn } from "react-hook-form";
import {
  chargeSchema,
  ChargeSchemaData,
} from "@/lib/schemas/transactions/charge";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextInput } from "./text-input";
import SelectComponent from "./select-component";
import { regions } from "@/lib/constants/regions";
import { useEffect, useState } from "react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "./ui/input-otp";
import { PaystackStatus } from "@/lib/types/transactions";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { toast } from "sonner";
import mtn from "@/public/mtn.png";
import telecel from "@/public/telecel.png";
import airtel from "@/public/airtel.png";
import Image from "next/image";
import { cn, formatCurrency } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";

const providersImages = [
  {
    src: mtn,
    alt: "MTN Mobile Money",
    value: MobileMoneyProvider.MTN,
    name: "MTN",
    color: "bg-yellow-500",
  },
  {
    src: telecel,
    alt: "Telecel Cash",
    value: MobileMoneyProvider.TELECEL,
    name: "Telecel",
    color: "bg-blue-600",
  },
  {
    src: airtel,
    alt: "AirtelTigo Money",
    value: MobileMoneyProvider.AIRTELTIGO,
    name: "AirtelTigo",
    color: "bg-red-500",
  },
];

interface CheckoutDialogProps {
  isOpen: boolean;
  onClose: () => void;
  total: number;
  cartId?: string;
  productId?: string;
  variantId?: string;
  from?: "cart" | "product";
}

function AddressForm({ form }: { form: UseFormReturn<ChargeSchemaData> }) {
  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <SelectComponent
          name="address.region"
          label="Region"
          control={form.control}
          error={form.formState.errors.address?.region?.message}
          items={regions}
          placeholder="Select region"
        />

        <TextInput
          control={form.control}
          name="address.city"
          label="City"
          placeholder="Enter your city"
          error={form.formState.errors.address?.city?.message}
        />
      </div>

      <TextInput
        control={form.control}
        name="address.address_line1"
        label="Street Address"
        placeholder="Enter your street address"
        error={form.formState.errors.address?.address_line1?.message}
      />

      <TextInput
        control={form.control}
        name="address.address_line2"
        label="Apartment, Suite, etc. (Optional)"
        placeholder="Apartment, suite, unit, etc."
        error={form.formState.errors.address?.address_line2?.message}
      />

      <TextInput
        control={form.control}
        name="address.digital_address"
        label="Digital Address (Optional)"
        placeholder="e.g., GS-1234-5678"
        error={form.formState.errors.address?.digital_address?.message}
      />
    </div>
  );
}

export function CheckoutDialog({
  isOpen,
  onClose,
  productId,
  variantId,
  from,
  total,
}: CheckoutDialogProps) {
  const {}=authClient.useSession
  const [isAddingNewAddress, setIsAddingNewAddress] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<PaystackStatus | null>(
    null
  );
  const [paymentMessage, setPaymentMessage] = useState<string | null>(null);
  const [otp, setOtp] = useState("");
  const [reference, setReference] = useState<string | null>(null);

  const form = useForm<ChargeSchemaData>({
    resolver: zodResolver(chargeSchema),
    defaultValues: {
      addressId: "",
      phoneNumber: "",
      productId: productId,
      variantId: variantId,
      provider: "MTN",
      saveForFuture: false,
    },
  });

  const {
    formState: { errors },
  } = form;
  const {
    addresses,
    isLoading: isLoadingAddresses,
    error: addressesError,
  } = useAddress();

  useEffect(() => {
    if (errors.provider) {
      toast.error(errors.provider.message);
    }
    if (errors.addressId) {
      toast.error("Address is required", {
        description: "Please select an address from the list or add a new one",
      });
    }
  }, [errors.provider, errors.addressId]);

  useEffect(() => {
    if (!isLoadingAddresses && addresses && addresses.length > 0) {
      form.setValue("addressId", addresses[0]?.id);
    }
  }, [addresses, isLoadingAddresses, form]);

  const selectedAddressId = form.watch("addressId");
  const selectedProvider = form.watch("provider");

  const handleOtpSubmit = async (otp: string) => {
    try {
      const res = await fetch("/api/transactions/charge/otp", {
        method: "POST",
        body: JSON.stringify({ otp, reference }),
      });
      const response = await res.json();
      if (!res.ok) {
        throw new Error(response.error.message || "An error occurred");
      }
      // Handle successful OTP verification
      toast.success("Payment verified successfully!");
      onClose();
    } catch (error: any) {
      toast.error(error.message);
      setOtp("");
    }
  };

  const onSubmit = async (data: ChargeSchemaData) => {
    try {
      const res = await fetch(`/api/transactions/charge?from=${from}`, {
        method: "POST",
        body: JSON.stringify(data),
      });
      const response = await res.json();

      if (!res.ok) {
        toast.error(response.error.message);
        return;
      }

      if (response.success) {
        const status = response.data.data.status as PaystackStatus;
        setPaymentStatus(status);
        setPaymentMessage(response.data.data.display_text);
        setReference(response.data.data.reference);
      }
    } catch (error) {
      console.error("Payment error:", error);
      setPaymentMessage("An error occurred while processing your payment");
    }
  };

  const handleProviderChange = async (value: MobileMoneyProvider) => {
    form.setValue("provider", value);
    if (form.getValues("phoneNumber")) {
      await form.trigger("phoneNumber");
    }
  };

  const resetDialog = () => {
    setPaymentStatus(null);
    setPaymentMessage(null);
    setOtp("");
    setReference(null);
    form.reset();
  };

  const handleClose = () => {
    resetDialog();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-2xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border-0 p-0 overflow-hidden">
        {/* Header */}
        <DialogHeader className="px-6 py-5 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            {(paymentStatus === "pay_offline" ||
              paymentStatus === "send_otp") && (
              <Button
                variant="ghost"
                size="sm"
                onClick={resetDialog}
                className="p-2 hover:bg-white/50 dark:hover:bg-gray-700/50"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
            )}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <CreditCard className="w-4 h-4 text-white" />
              </div>
              <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white">
                Secure Checkout
              </DialogTitle>
            </div>
          </div>

          {/* Progress indicators */}
          {!paymentStatus && (
            <div className="flex items-center space-x-2 mt-4">
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              <div className="flex-1 h-1 bg-gray-200 dark:bg-gray-600 rounded"></div>
              <div className="w-2 h-2 bg-gray-200 dark:bg-gray-600 rounded-full"></div>
              <div className="flex-1 h-1 bg-gray-200 dark:bg-gray-600 rounded"></div>
              <div className="w-2 h-2 bg-gray-200 dark:bg-gray-600 rounded-full"></div>
            </div>
          )}
        </DialogHeader>

        {/* Payment Processing State */}
        {paymentStatus === "pay_offline" ? (
          <div className="px-6 py-12 flex flex-col items-center justify-center space-y-6">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-white" />
              </div>
            </div>

            <div className="text-center space-y-3 max-w-md">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Payment Initiated
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {paymentMessage ||
                  "Please check your mobile money account and follow the prompts to complete your payment."}
              </p>
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mt-4">
                <p className="text-sm text-blue-800 dark:text-blue-300">
                  <strong>Amount:</strong> {formatCurrency(total)} •{" "}
                  <strong>Reference:</strong> {reference}
                </p>
              </div>
            </div>
          </div>
        ) : /* OTP Verification State */
        paymentStatus === "send_otp" ? (
          <div className="px-6 py-12 space-y-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center mx-auto">
                <Phone className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Enter Verification Code
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {paymentMessage ||
                    "Please enter the 6-digit code sent to your mobile money account"}
                </p>
              </div>
            </div>

            <div className="flex flex-col items-center space-y-6">
              <InputOTP
                maxLength={6}
                pattern={REGEXP_ONLY_DIGITS}
                value={otp}
                onChange={setOtp}
                onComplete={(value) => setOtp(value)}
              >
                <InputOTPGroup className="gap-3">
                  {[...Array(6)].map((_, index) => (
                    <InputOTPSlot
                      key={index}
                      index={index}
                      className="w-12 h-12 text-lg font-bold border-2 border-gray-300 dark:border-gray-600 rounded-lg"
                    />
                  ))}
                </InputOTPGroup>
              </InputOTP>

              <Button
                onClick={() => handleOtpSubmit(otp)}
                disabled={otp.length !== 6}
                className="w-full max-w-xs bg-green-600 hover:bg-green-700 text-white h-12 font-semibold"
              >
                Verify & Complete Payment
              </Button>
            </div>
          </div>
        ) : (
          /* Main Checkout Form */
          <div className="max-h-[70vh] overflow-y-auto">
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Delivery Address Section */}
              <div className="px-6 py-6 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
                    <MapPin className="w-5 h-5 text-blue-600" />
                    <span>Delivery Address</span>
                  </h3>
                  {addresses && addresses.length > 0 && !isAddingNewAddress && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setIsAddingNewAddress(true)}
                      className="text-blue-600 border-blue-600 hover:bg-blue-50"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add New
                    </Button>
                  )}
                </div>

                {isLoadingAddresses && (
                  <div className="flex items-center space-x-2 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <Loader2 className="w-4 h-4 animate-spin text-gray-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Loading addresses...
                    </span>
                  </div>
                )}

                {addressesError && (
                  <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <p className="text-sm text-red-600 dark:text-red-400">
                      Error loading addresses. Please try again.
                    </p>
                  </div>
                )}

                {!isAddingNewAddress && addresses?.length === 0 && (
                  <div className="text-center p-8 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600 dark:text-gray-400 mb-3">
                      No saved addresses found
                    </p>
                    <Button
                      type="button"
                      onClick={() => setIsAddingNewAddress(true)}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Add Your First Address
                    </Button>
                  </div>
                )}

                {addresses && addresses.length > 0 && !isAddingNewAddress && (
                  <RadioGroup
                    value={selectedAddressId}
                    onValueChange={(id) => {
                      form.setValue("addressId", id);
                      setIsAddingNewAddress(false);
                    }}
                    className="space-y-3"
                  >
                    {addresses.map((address: Address) => (
                      <Label
                        key={address.id}
                        htmlFor={address.id}
                        className={cn(
                          "flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-200",
                          selectedAddressId === address.id
                            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-md"
                            : "border-gray-200 dark:border-gray-700 hover:border-blue-300 hover:bg-blue-50/50 dark:hover:bg-blue-900/10"
                        )}
                      >
                        <RadioGroupItem
                          value={address.id}
                          id={address.id}
                          className="mr-4"
                        />
                        <MapPin
                          className={cn(
                            "w-5 h-5 mr-3 flex-shrink-0",
                            selectedAddressId === address.id
                              ? "text-blue-600"
                              : "text-gray-400"
                          )}
                        />
                        <div className="flex-grow">
                          <p className="font-medium text-gray-900 dark:text-white">
                            {address.address_line1}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {address.city}, {address.region}
                            {address.digital_address &&
                              ` • ${address.digital_address}`}
                          </p>
                        </div>
                      </Label>
                    ))}
                  </RadioGroup>
                )}

                {isAddingNewAddress && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        Add New Address
                      </h4>
                      {addresses && addresses.length > 0 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setIsAddingNewAddress(false)}
                          className="text-blue-600 hover:text-blue-700"
                        >
                          Use Existing Address
                        </Button>
                      )}
                    </div>
                    <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-xl">
                      <AddressForm form={form} />
                    </div>
                  </div>
                )}
              </div>

              {/* Payment Method Section */}
              <div className="px-6 py-6 border-t border-gray-200 dark:border-gray-700 space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
                  <CreditCard className="w-5 h-5 text-blue-600" />
                  <span>Payment Method</span>
                </h3>

                <div className="space-y-4">
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Choose your mobile money provider
                  </Label>

                  <div className="grid grid-cols-3 gap-3">
                    {providersImages.map((provider) => (
                      <button
                        key={provider.value}
                        type="button"
                        onClick={() => handleProviderChange(provider.value)}
                        className={cn(
                          "p-4 rounded-xl border-2 transition-all duration-200 flex flex-col items-center space-y-2 hover:shadow-md",
                          selectedProvider === provider.value
                            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-md"
                            : "border-gray-200 dark:border-gray-700 hover:border-blue-300"
                        )}
                      >
                        <div className="relative">
                          <Image
                            src={provider.src}
                            alt={provider.alt}
                            width={40}
                            height={40}
                            className="object-contain"
                          />
                          {selectedProvider === provider.value && (
                            <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                              <CheckCircle className="w-3 h-3 text-white" />
                            </div>
                          )}
                        </div>
                        <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                          {provider.name}
                        </span>
                      </button>
                    ))}
                  </div>

                  {selectedProvider && (
                    <div className="mt-4">
                      <TextInput
                        control={form.control}
                        name="phoneNumber"
                        label="Mobile Money Number"
                        placeholder="e.g., 024 123 4567"
                        error={form.formState.errors.phoneNumber?.message}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Order Summary */}
              <div className="px-6 py-6 bg-gray-50 dark:bg-gray-800">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Order Summary
                  </h3>
                  <div className="flex justify-between items-center text-xl font-bold">
                    <span className="text-gray-900 dark:text-white">
                      Total Amount:
                    </span>
                    <span className="text-blue-600">
                      {formatCurrency(total)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-6 border-t border-gray-200 dark:border-gray-700 space-y-4">
                {/* Security Notice */}
                <div className="flex items-center justify-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                  <Shield className="w-4 h-4" />
                  <span>Secured by 256-bit SSL encryption</span>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={form.formState.isSubmitting}
                  className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-base rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  {form.formState.isSubmitting ? (
                    <div className="flex items-center space-x-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Processing Payment...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-2">
                      <span>Pay {formatCurrency(total)}</span>
                      <CreditCard className="w-5 h-5" />
                    </div>
                  )}
                </Button>

                {/* Terms */}
                <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                  By proceeding, you agree to our Terms of Service and Privacy
                  Policy
                </p>
              </div>
            </form>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

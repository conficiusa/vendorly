"use client";
import { useAddress } from "@/lib/swr/useAddresses";
import { Address, MobileMoneyProvider } from "@/prisma/generated/prisma-client";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import {
  MapPin,
  Loader2,
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
import { useEffect, useState, useRef } from "react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "./ui/input-otp";
import { PaystackStatus } from "@/lib/types/transactions";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { toast } from "sonner";
import mtn from "@/public/mtn.png";
import telecel from "@/public/telecel.png";
import airtel from "@/public/airtel.png";
import Image from "next/image";
import { cn, formatCurrency } from "@/lib/utils";

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
  total: number;
  productId?: string;
  variantId?: string;
  from?: "cart" | "product";
}

function AddressForm({ form }: { form: UseFormReturn<ChargeSchemaData> }) {
  return (
    <div className="space-y-6">
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

export function CheckoutForm({
  total,
  productId,
  variantId,
  from = "cart",
}: CheckoutDialogProps) {
  const [isAddingNewAddress, setIsAddingNewAddress] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<PaystackStatus | null>(
    null
  );
  const [paymentMessage, setPaymentMessage] = useState<string | null>(null);
  const [otp, setOtp] = useState("");
  const [reference, setReference] = useState<string | null>(null);
  const [isPolling, setIsPolling] = useState(false);
  const [pollingTimeRemaining, setPollingTimeRemaining] = useState(0);

  // Refs for cleanup
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const pollingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);

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

  // Cleanup polling on unmount or status change
  useEffect(() => {
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
      if (pollingTimeoutRef.current) {
        clearTimeout(pollingTimeoutRef.current);
      }
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
      }
    };
  }, []);

  // Start polling when payment status changes to "pay_offline"
  useEffect(() => {
    if (paymentStatus === "pay_offline" && reference) {
      startPolling();
    } else {
      stopPolling();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paymentStatus, reference]);

  const checkTransactionStatus = async () => {
    if (!reference) return;

    try {
      const res = await fetch(
        `/api/transactions/status?reference=${reference}`
      );
      const response = await res.json();

      if (res.ok && response.success) {
        const transaction = response.data.transaction;

        if (transaction.status === "SUCCESS") {
          toast.success("Payment confirmed successfully!");
          setPaymentStatus(null);
          setPaymentMessage("Payment completed successfully!");
          stopPolling();
          // You can redirect or update UI here
        } else if (transaction.status === "FAILED") {
          toast.error("Payment failed. Please try again.");
          setPaymentStatus(null);
          setPaymentMessage("Payment failed. Please try again.");
          stopPolling();
        }
        // If status is still PENDING, continue polling
      }
    } catch (error) {
      console.error("Error checking transaction status:", error);
    }
  };

  const startPolling = () => {
    if (isPolling) return;

    setIsPolling(true);
    setPollingTimeRemaining(120); // 2 minutes

    // Start countdown
    countdownIntervalRef.current = setInterval(() => {
      setPollingTimeRemaining((prev) => {
        if (prev <= 1) {
          stopPolling();
          toast.error("Payment confirmation timeout. Please try again.");
          setPaymentStatus(null);
          setPaymentMessage("Payment confirmation timeout. Please try again.");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Start polling after 8 seconds
    pollingTimeoutRef.current = setTimeout(() => {
      // Initial check
      checkTransactionStatus();

      // Then poll every 15 seconds
      pollingIntervalRef.current = setInterval(() => {
        checkTransactionStatus();
      }, 15000);
    }, 8000);

    // Stop polling after 2 minutes total
    setTimeout(() => {
      if (isPolling) {
        stopPolling();
        toast.error("Payment confirmation timeout. Please try again.");
        setPaymentStatus(null);
        setPaymentMessage("Payment confirmation timeout. Please try again.");
      }
    }, 120000);
  };

  const stopPolling = () => {
    setIsPolling(false);
    setPollingTimeRemaining(0);

    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
    if (pollingTimeoutRef.current) {
      clearTimeout(pollingTimeoutRef.current);
      pollingTimeoutRef.current = null;
    }
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

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
    stopPolling();
    setPaymentStatus(null);
    setPaymentMessage(null);
    setOtp("");
    setReference(null);
    form.reset();
  };

  return (
    <div className="max-w-2xl mx-auto bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="border-b border-gray-100 dark:border-gray-800 pb-6 mb-8">
        <div className="flex items-center gap-3">
          {(paymentStatus === "pay_offline" ||
            paymentStatus === "send_otp") && (
            <Button
              variant="ghost"
              size="sm"
              onClick={resetDialog}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
          )}
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Checkout
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
              Complete your purchase securely
            </p>
          </div>
        </div>
      </div>

      {/* Payment Processing State */}
      {paymentStatus === "pay_offline" ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 mx-auto mb-6 relative">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            <CheckCircle className="w-5 h-5 text-green-600 absolute -top-1 -right-1 bg-white rounded-full" />
          </div>

          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
            Payment Initiated
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
            {paymentMessage ||
              "Please check your mobile money account and follow the prompts to complete your payment."}
          </p>

          <div className="inline-flex items-center gap-4 text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 px-4 py-3 rounded-lg mb-6">
            <span>
              <strong>Amount:</strong> {formatCurrency(total)}
            </span>
            <span>•</span>
            <span>
              <strong>Ref:</strong> {reference}
            </span>
          </div>

          {/* Polling status */}
          {isPolling && pollingTimeRemaining > 0 && (
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Checking for payment confirmation...</span>
              </div>
              <p className="text-xs text-gray-400 dark:text-gray-500">
                Timeout in {formatTime(pollingTimeRemaining)}
              </p>
            </div>
          )}
        </div>
      ) : paymentStatus === "send_otp" ? (
        /* OTP Verification State */
        <div className="text-center py-16">
          <div className="w-16 h-16 mx-auto mb-6 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
            <Phone className="w-8 h-8 text-green-600" />
          </div>

          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
            Enter Verification Code
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            {paymentMessage ||
              "Please enter the 6-digit code sent to your mobile money account"}
          </p>

          <div className="space-y-6">
            <InputOTP
              maxLength={6}
              pattern={REGEXP_ONLY_DIGITS}
              value={otp}
              onChange={setOtp}
              onComplete={(value) => setOtp(value)}
            >
              <InputOTPGroup className="gap-2">
                {[...Array(6)].map((_, index) => (
                  <InputOTPSlot
                    key={index}
                    index={index}
                    className="w-12 h-12 text-lg font-semibold border border-gray-300 dark:border-gray-600 rounded-lg"
                  />
                ))}
              </InputOTPGroup>
            </InputOTP>

            <Button
              onClick={() => handleOtpSubmit(otp)}
              disabled={otp.length !== 6}
              className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-2 h-auto"
            >
              Verify Payment
            </Button>
          </div>
        </div>
      ) : (
        /* Main Checkout Form */
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Delivery Address Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                Delivery Address
              </h2>
              {addresses && addresses.length > 0 && !isAddingNewAddress && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsAddingNewAddress(true)}
                  className="border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add New
                </Button>
              )}
            </div>

            {isLoadingAddresses && (
              <div className="flex items-center gap-2 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
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
              <div className="text-center p-8 border border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
                <MapPin className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  No saved addresses found
                </p>
                <Button
                  type="button"
                  onClick={() => setIsAddingNewAddress(true)}
                  className="bg-gray-900 hover:bg-gray-800 text-white"
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
                      "flex items-start gap-3 p-4 border rounded-lg cursor-pointer transition-colors",
                      selectedAddressId === address.id
                        ? "border-primary bg-gray-50 dark:bg-gray-800"
                        : "border-gray-200 dark:border-gray-700 hover:border-gray-300"
                    )}
                  >
                    <RadioGroupItem
                      value={address.id}
                      id={address.id}
                      className="mt-1"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 dark:text-white">
                        {address.address_line1}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
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
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    Add New Address
                  </h3>
                  {addresses && addresses.length > 0 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsAddingNewAddress(false)}
                      className="text-gray-600 hover:text-gray-900"
                    >
                      Cancel
                    </Button>
                  )}
                </div>
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                  <AddressForm form={form} />
                </div>
              </div>
            )}
          </div>

          {/* Payment Method Section */}
          <div className="space-y-4">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">
              Payment Method
            </h2>

            <div className="space-y-4">
              <Label className="text-sm text-gray-700 dark:text-gray-300">
                Mobile Money Provider
              </Label>

              <div className="grid grid-cols-3 gap-3">
                {providersImages.map((provider) => (
                  <button
                    key={provider.value}
                    type="button"
                    onClick={() => handleProviderChange(provider.value)}
                    className={cn(
                      "relative p-4 border rounded-lg transition-colors flex flex-col items-center gap-2",
                      selectedProvider === provider.value
                        ? "border-primary bg-gray-50 dark:bg-gray-800"
                        : "border-gray-200 dark:border-gray-700 hover:border-gray-300"
                    )}
                  >
                    <Image
                      src={provider.src}
                      alt={provider.alt}
                      width={32}
                      height={32}
                      className="object-contain"
                    />
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                      {provider.name}
                    </span>
                    {selectedProvider === provider.value && (
                      <CheckCircle className="w-4 h-4 text-gray-900 absolute top-2 right-2" />
                    )}
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
          <div className="border-t border-gray-100 dark:border-gray-800 pt-6">
            <div className="flex justify-between items-center">
              <span className="text-lg font-medium text-gray-900 dark:text-white">
                Total
              </span>
              <span className="text-2xl font-semibold text-gray-900 dark:text-white">
                {formatCurrency(total)}
              </span>
            </div>
          </div>

          {/* Submit Button */}
          <div className="space-y-4">
            <Button
              type="submit"
              disabled={form.formState.isSubmitting}
              className="w-full h-12 font-medium"
            >
              {form.formState.isSubmitting ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Processing...</span>
                </div>
              ) : (
                <span>Pay {formatCurrency(total)}</span>
              )}
            </Button>

            <div className="flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              <Shield className="w-3 h-3" />
              <span>Secured by 256-bit SSL encryption</span>
            </div>

            <p className="text-xs text-center text-gray-400 dark:text-gray-500">
              By proceeding, you agree to our Terms of Service and Privacy
              Policy
            </p>
          </div>
        </form>
      )}
    </div>
  );
}

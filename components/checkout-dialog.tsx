import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useAddress } from "@/lib/swr/useAddresses";
import { Address, MobileMoneyProvider } from "@/prisma/generated/prisma-client";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { MapPin, Loader2 } from "lucide-react";
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
import { cn } from "@/lib/utils";

const providersImages = [
  { src: mtn, alt: "mtn logo", value: MobileMoneyProvider.MTN },
  { src: telecel, alt: "telecel logo", value: MobileMoneyProvider.TELECEL },
  { src: airtel, alt: "airtel logo", value: MobileMoneyProvider.AIRTELTIGO },
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
      <div className="grid sm:grid-cols-2 gap-4 max-sm:gap-2">
        <SelectComponent
          name="address.region"
          label="Region"
          control={form.control}
          error={form.formState.errors.address?.region?.message}
          items={regions}
          placeholder="Choose region"
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
        label="Address Line 1"
        placeholder="Enter your street address"
        error={form.formState.errors.address?.address_line1?.message}
      />

      <TextInput
        control={form.control}
        name="address.address_line2"
        label="Address Line 2 (Optional)"
        placeholder="Apartment, suite, unit, etc. (optional)"
        error={form.formState.errors.address?.address_line2?.message}
      />

      <TextInput
        control={form.control}
        name="address.digital_address"
        label="Digital Address (Optional)"
        placeholder="Enter your digital address (optional)"
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
      address: {
        region: "",
        city: "",
        address_line1: "",
        address_line2: "",
        digital_address: "",
      },
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
      toast.error(errors.provider.message +"aa");
    }
    if (errors.address) {
      toast.warning("Please fill in all address fields");
    }
  }, [errors.provider, errors.address]);

  useEffect(() => {
    if (!isLoadingAddresses && addresses) {
      form.setValue("addressId", addresses[0]?.id);
    }
  }, [addresses, isLoadingAddresses, form]);

  const selectedAddressId = form.watch("addressId");

  const handleOtpSubmit = async (otp: string) => {
    try {
      const res = await fetch("/api/transactions/charge/otp", {
        method: "POST",
        body: JSON.stringify({
          otp,
          reference,
        }),
      });
      const response = await res.json();
      if (!res.ok) {
        throw new Error(response.error.message || "An error occurred");
      }
    } catch (error: any) {
      toast.error(error.message);
      setOtp("");
    }
  };

  useEffect(() => {
  console.log(errors)
},[errors])
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
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg bg-card rounded-xl shadow-2xl border-border p-0">
        <DialogHeader className="px-6 py-4 border-b border-border">
          <DialogTitle className="text-xl font-bold">Checkout</DialogTitle>
        </DialogHeader>

        {paymentStatus === "pay_offline" ? (
          <div className="px-6 py-12 flex flex-col items-center justify-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-primary animate-spin [animation-duration:4s]" />
            </div>
            <div className="text-center space-y-3">
              <h3 className="text-lg font-semibold">
                Awaiting Payment Confirmation
              </h3>
              <p className="text-muted-foreground text-sm max-w-sm">
                {paymentMessage}
              </p>
            </div>
          </div>
        ) : paymentStatus === "send_otp" ? (
          <div className="px-6 py-12 space-y-6 flex flex-col justify-center items-center">
            <div className="space-y-6 mx-auto flex flex-col justify-between items-center">
              <div className="text-center space-y-3">
                <h3 className="text-lg font-semibold">
                  Awaiting Payment Confirmation
                </h3>
                <p className="text-muted-foreground text-sm max-w-sm">
                  {paymentMessage}
                </p>
              </div>
              <InputOTP
                maxLength={6}
                pattern={REGEXP_ONLY_DIGITS}
                onComplete={(value) => setOtp(value)}
              >
                <InputOTPGroup>
                  {[...Array(6)].map((_, index) => (
                    <InputOTPSlot key={index} index={index} />
                  ))}
                </InputOTPGroup>
              </InputOTP>
            </div>
            <Button
              onClick={() => handleOtpSubmit(otp)}
              disabled={otp.length !== 6}
              className="w-full"
            >
              Verify OTP
            </Button>
          </div>
        ) : (
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="px-6  space-y-8 max-h-[65vh] overflow-y-auto scrollbar-thin scrollbar-thumb-muted-foreground/50 scrollbar-track-secondary/30"
          >
            <div className="space-y-4">
              <Label
                htmlFor="address"
                className="text-md font-semibold text-foreground"
              >
                Delivery Address
              </Label>
              {isLoadingAddresses && (
                <p className="text-sm text-muted-foreground">
                  Loading addresses...
                </p>
              )}
              {addressesError && (
                <p className="text-sm text-destructive">
                  Error loading addresses.
                </p>
              )}
              {!isAddingNewAddress && addresses?.length === 0 && (
                <p className="text-muted-foreground text-sm">
                  You do not have any saved addresses;{" "}
                  <span
                    className="text-primary cursor-default"
                    onClick={() => setIsAddingNewAddress(true)}
                  >
                    Add a new address
                  </span>
                </p>
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
                      className={`flex items-center p-4 rounded-lg border cursor-pointer transition-all duration-200 ease-in-out 
                                  ${
                                    selectedAddressId === address.id
                                      ? "border-primary bg-primary/10 ring-2 ring-primary shadow-md"
                                      : "border-muted hover:border-primary/50 hover:bg-primary/5"
                                  }`}
                    >
                      <RadioGroupItem
                        value={address.id}
                        id={address.id}
                        className="mr-3 peer sr-only"
                      />
                      <MapPin
                        className={`w-5 h-5 mr-3 flex-shrink-0 ${selectedAddressId === address.id ? "text-primary" : "text-muted-foreground"}`}
                      />
                      <div className="flex-grow">
                        <p
                          className={`font-medium ${selectedAddressId === address.id ? "text-primary" : "text-foreground"}`}
                        >
                          {address.address_line1}
                        </p>
                        <p
                          className={`text-xs ${selectedAddressId === address.id ? "text-primary/80" : "text-muted-foreground"}`}
                        >
                          {address.city}, {address.region}
                          {address.digital_address &&
                            ` (${address.digital_address})`}
                        </p>
                      </div>
                    </Label>
                  ))}
                </RadioGroup>
              )}
            </div>
            {isAddingNewAddress && (
              <div className="space-y-4">
                {addresses.length > 0 && (
                  <p className="text-muted-foreground text-sm">
                    You have {addresses.length} saved addresses{" "}
                    <span
                      className="text-primary cursor-default"
                      onClick={() => setIsAddingNewAddress(false)}
                    >
                      Choose from existing Addresses
                    </span>
                  </p>
                )}
                <AddressForm form={form} />
              </div>
            )}

            <div className="space-y-4">
              <h3 className="text-xl font-bold">Payment Details</h3>

              <div className="space-y-4">
                <p className="font-medium">
                  Choose your mobile money provider:
                </p>
                <div className="flex items-center gap-4">
                  {providersImages.map((provider, index) => (
                    <button
                      type="button"
                      key={index}
                      onClick={() => handleProviderChange(provider.value)}
                      className={cn(
                        "p-2 rounded-lg border-2 border-muted-foreground/50 transition-all duration-200 hover:border-primary/50",
                        form.watch("provider") === provider.value &&
                          "border-primary bg-primary/20 shadow-md scale-105 [&>img]:mix-blend-multiply"
                      )}
                    >
                      <Image
                        key={index}
                        src={provider.src}
                        alt={provider.alt}
                        width={100}
                        height={100}
                        className="aspect-video object-cover rounded-lg sm:block h-auto"
                      />
                    </button>
                  ))}
                </div>
                {form.watch("provider") && (
                  <TextInput
                    control={form.control}
                    name="phoneNumber"
                    label={`Mobile Money Number`}
                    placeholder="Enter your mobile money number"
                    error={form.formState.errors.phoneNumber?.message}
                    labelClassName="capitalize"
                  />
                )}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="saveForFuture"
                className="form-checkbox h-4 w-4 text-primary border-muted rounded focus:ring-primary"
              />
              <Label
                htmlFor="saveForFuture"
                className="text-sm font-medium text-foreground"
              >
                Save these details for future purchases
              </Label>
            </div>

            <div className="pt-6 border-t border-border/50">
              <div className="flex justify-between items-center">
                <p className="text-lg font-semibold text-foreground">
                  Total Amount:
                </p>
                <p className="text-xl font-bold">GHS {total.toFixed(2)}</p>
              </div>
            </div>
            <DialogFooter className="py-6 px-6 border-t border-border rounded-b-xl bg-muted/5">
              <div className="w-full space-y-4">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Secure payment powered by</span>
                  <div className="flex items-center gap-2">
                    <Image
                      src="/mtn.png"
                      alt="MTN Mobile Money"
                      width={24}
                      height={24}
                      className="object-contain"
                    />
                    <Image
                      src="/airtel.png"
                      alt="AirtelTigo Money"
                      width={24}
                      height={24}
                      className="object-contain"
                    />
                    <Image
                      src="/telecel.png"
                      alt="Telecel Money"
                      width={24}
                      height={24}
                      className="object-contain"
                    />
                  </div>
                </div>
                <Button
                  type="submit"
                  disabled={form.formState.isSubmitting}
                  className="w-full h-12 text-base font-semibold bg-primary hover:bg-primary/90 transition-colors duration-200"
                >
                  {form.formState.isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Processing Payment...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <span>Pay GHS {total.toFixed(2)}</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="ml-1"
                      >
                        <path d="M5 12h14" />
                        <path d="m12 5 7 7-7 7" />
                      </svg>
                    </div>
                  )}
                </Button>
                <p className="text-xs text-center text-muted-foreground">
                  By clicking Pay, you agree to our Terms of Service and Privacy
                  Policy
                </p>
              </div>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

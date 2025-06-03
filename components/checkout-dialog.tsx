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

interface CheckoutDialogProps {
  isOpen: boolean;
  onClose: () => void;
  total: number;
  cartId?: string;
  productId?: string;
  variantId?: string;
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
  total,
}: CheckoutDialogProps) {
  const [isAddingNewAddress, setIsAddingNewAddress] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<PaystackStatus | null>(
    null
  );
  const [paymentMessage, setPaymentMessage] = useState<string | null>(null);
  const [otp, setOtp] = useState("");
  const [reference, setReference] = useState<string | null>(null);

  console.log(paymentStatus);

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
    addresses,
    isLoading: isLoadingAddresses,
    error: addressesError,
  } = useAddress();

  useEffect(() => {
    if (!isLoadingAddresses && addresses) {
      form.setValue("addressId", addresses[0].id);
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

  const onSubmit = async (data: ChargeSchemaData) => {
    try {
      const res = await fetch("/api/transactions/charge?from=cart", {
        method: "POST",
        body: JSON.stringify(data),
      });
      const response = await res.json();

      console.log(response);

      if (response.success) {
        const status = response.data.data.status as PaystackStatus;
        console.log(status);
        setPaymentStatus(status);
        setPaymentMessage(response.data.data.display_text);
        setReference(response.data.data.reference);

        if (status === "pay_offline") {
          // Close dialog after 3 seconds for offline payment
          setTimeout(() => {
            onClose();
          }, 3000);
        }
      }
    } catch (error) {
      console.error("Payment error:", error);
      setPaymentMessage("An error occurred while processing your payment");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg bg-card rounded-xl shadow-2xl border-border p-0">
        <DialogHeader className="px-6 py-2">
          <DialogTitle className="text-xl font-bold">Checkout</DialogTitle>
        </DialogHeader>

        {paymentStatus === "pay_offline" ? (
          <div className="px-6 py-8 flex flex-col items-center justify-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-primary animate-spin [animation-duration:4s]" />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-lg font-semibold">
                Awaiting Payment Confirmation
              </h3>
              <p className="text-muted-foreground text-sm max-w-sm">
                {paymentMessage}
              </p>
            </div>
          </div>
        ) : paymentStatus === "send_otp" ? (
          <div className="px-6 space-y-4 py-8 gap-4 flex flex-col justify-center items-center">
            <div className="space-y-5 mx-auto flex flex-col justify-between items-center">
              <div className="text-center">
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
            className="px-6 space-y-5 max-h-[65vh] overflow-y-auto scrollbar-thin scrollbar-thumb-muted-foreground/50 scrollbar-track-secondary/30"
          >
            <div className="space-y-3">
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
                <p className="text-muted-foreground text-sm ">
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
                  className="space-y-2"
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
              <div>
                {addresses.length > 0 && (
                  <p className="text-muted-foreground text-sm ">
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

            <h3 className="text-xl font-bold">Payment Details</h3>
            <TextInput
              control={form.control}
              name="phoneNumber"
              label="Phone Number"
              placeholder="Enter your phone number"
              error={form.formState.errors.phoneNumber?.message}
            />

            <SelectComponent
              name="provider"
              label="Mobile money provider"
              control={form.control}
              error={form.formState.errors?.provider?.message}
              items={Object.values(MobileMoneyProvider).map((p) => ({
                value: p,
                label: p.toLowerCase().replace(/_/g, " "),
              }))}
              placeholder="Choose provider"
            />

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

            <div className="pt-4 border-t border-border/50">
              <div className="flex justify-between items-center">
                <p className="text-lg font-semibold text-foreground">
                  Total Amount:
                </p>
                <p className="text-xl font-bold">GHS {total.toFixed(2)}</p>
              </div>
            </div>
            <DialogFooter className="py-4 border-t border-border rounded-b-xl">
              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                className="w-full sm:w-[300px] mx-auto border-input"
              >
                {form.formState.isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Pay"
                )}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

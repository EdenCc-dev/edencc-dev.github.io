import { PT12Wrapper } from "@/components/Wrappers";
import {
  Form,
  Input,
  Button,
  RadioGroup,
  cn,
} from "@nextui-org/react";
import { useState } from "react";
import { toast } from "react-toastify";
import CustomRadio from "@/components/Radio";

const FormInputWithLabel = ({
  placeholder,
  label,
  className,
  validate,
  ...props
}: {
  placeholder: string;
  label: string;
  className?: string;
  validate?: (value: string) => string | null;
  [key: string]: any;
}) => {
  return (
    <Input
      validate={validate}
      placeholder={placeholder}
      labelPlacement="outside"
      variant="bordered"
      label={
        <span className="teachers-16-400 text-sub !normal-case">{label}</span>
      }
      isRequired
      className={cn(className, "text-base")}
      classNames={{
        inputWrapper: "min-h-fit rounded-lg py-4",
        label: "h-[30px]",
      }}
      {...props}
    />
  );
};

const ContactUs = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    companyName: "",
    telegramHandle: "",
    whatcanwehelpyouwith: "",
    topic: "",
  });

  const onSubmit = (e: React.FormEvent) => {
    setIsLoading(true);
    e.preventDefault();

    const params = new URLSearchParams();
    params.append("First-Name", formData.firstName);
    params.append("Last-Name", formData.lastName);
    params.append("Email", formData.email);
    params.append("Company-Name", formData.companyName);
    params.append("Telegram-Handle", formData.telegramHandle);
    params.append("field", formData.whatcanwehelpyouwith);
    params.append("Topic", formData.topic);
    const formBody = params.toString();

    fetch("https://submit-form.com/tChnyWtrR", {
      method: "POST",
      headers: {
        accept: "application/json, text/javascript, */*; q=0.01",
        "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
        priority: "u=1, i",
      },
      body: formBody,
      referrerPolicy: "strict-origin-when-cross-origin",
      mode: "cors",
      credentials: "omit",
    })
      .then((response) => {
        if (response.ok) {
          toast.success("Submit Form Success");
        } else {
          toast.error("Submit Form Failed");
        }
      })
      .catch((error) => {
        console.error("Submit Form Error", error);
        toast.error("Submit Form Failed");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  return (
    <PT12Wrapper className="w-full flex-1 flex flex-col">
      <>
        <h1 className="unbounded-36-180-200 text-center pb-12">
          Contact
          <br />
          Us
        </h1>
        <div className="p-2 pb-12 lg:p-12 bg-black flex-1 flex flex-col">
          <div className="pt-6 px-4 lg:px-12 flex flex-col lg:flex-row gap-4 main-container">
            <p className="flex-1 teachers-24-400 tracking-widest leading-[1.3]">
              Please fill in this form, we will get back to you as soon as we
              can.
            </p>

            <div className="flex-[2]">
              <Form onSubmit={onSubmit} className="flex flex-col gap-6">
                <div className="w-full flex items-center gap-4">
                  <FormInputWithLabel
                    validate={(value) => {
                      return null;
                    }}
                    className="flex-1"
                    placeholder="ENTER FIRST NAME HERE"
                    label="First Name"
                    value={formData.firstName}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setFormData({ ...formData, firstName: e.target.value });
                    }}
                  />
                  <FormInputWithLabel
                    validate={(value) => {
                      return null;
                    }}
                    className="flex-1"
                    placeholder="ENTER LAST NAME HERE"
                    label="Last Name"
                    value={formData.lastName}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setFormData({ ...formData, lastName: e.target.value });
                    }}
                  />
                </div>
                <FormInputWithLabel
                  validate={(value) => {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    const isValid = !value || emailRegex.test(value);
                    setIsEmailValid(isValid);
                    if (!isValid) return "Invalid Email Format";
                    return null;
                  }}
                  placeholder="ENTER EMAIL HERE"
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const newEmail = e.target.value;
                    setFormData({ ...formData, email: newEmail });
                  }}
                />
                <FormInputWithLabel
                  validate={(value) => {
                    return null;
                  }}
                  placeholder="ENTER COMPANY NAME HERE"
                  label="Company Name"
                  value={formData.companyName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setFormData({ ...formData, companyName: e.target.value });
                  }}
                />
                <FormInputWithLabel
                  validate={(value) => {
                    return null;
                  }}
                  placeholder="ENTER TELEGRAM HANDLE HERE"
                  label="Telegram Handle"
                  value={formData.telegramHandle}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setFormData({
                      ...formData,
                      telegramHandle: e.target.value,
                    });
                  }}
                />
                <FormInputWithLabel
                  validate={(value) => {
                    return null;
                  }}
                  placeholder="ENTER YOUR MESSAGE HERE"
                  label="What can we help you with?"
                  value={formData.whatcanwehelpyouwith}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setFormData({
                      ...formData,
                      whatcanwehelpyouwith: e.target.value,
                    });
                  }}
                />

                <div className="w-full">
                  <RadioGroup
                    classNames={{
                      label: "h-[30px]",
                      wrapper: "!flex-col lg:!flex-row [&_label]:!max-w-none lg:[&_label]:!max-w-fit",
                    }}
                    value={formData.topic}
                    onValueChange={(value) => {
                      setFormData({ ...formData, topic: value });
                    }}
                    isRequired
                    label={
                      <span className="teachers-16-400 text-sub !normal-case">
                        Topic
                      </span>
                    }
                    orientation="horizontal"
                    size="sm"
                  >
                    <CustomRadio value="other">Other</CustomRadio>
                    <CustomRadio value="cysic-network">
                      Cysic Network
                    </CustomRadio>
                    <CustomRadio value="asic-solutions">
                      Asic Solutions
                    </CustomRadio>
                    <CustomRadio value="gpu-acceleration">
                      Gpu Acceleration
                    </CustomRadio>
                  </RadioGroup>
                </div>

                <Button
                  isLoading={isLoading}
                  isDisabled={
                    !formData.firstName ||
                    !formData.lastName ||
                    !formData.email ||
                    !isEmailValid ||
                    !formData.companyName ||
                    !formData.telegramHandle ||
                    !formData.whatcanwehelpyouwith ||
                    !formData.topic
                  }
                  type="submit"
                  className="min-h-fit w-full py-6 teachers-16-400 bg-white text-black rounded-lg"
                >
                  Accelerate
                </Button>
              </Form>
            </div>
          </div>
        </div>
      </>
    </PT12Wrapper>
  );
};

export default ContactUs;

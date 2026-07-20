import { RegisterProgress } from "../components/register-progress";
import { BackButton } from "./components/back-button";
import { DocumentUploadForm } from "./components/document-upload-form";

export default function DocumentUploadPage() {
  return (
    <div className="flex w-full max-w-2xl flex-col gap-2 pb-2">
      <BackButton href="/register" />
      <RegisterProgress
        step={2}
        label="التحقق من النشاط التجاري"
        variant="linear"
      />
      <DocumentUploadForm />
    </div>
  );
}

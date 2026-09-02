import { locationSchema } from "./location";
import { promotionSchema } from "./promotion";
import { productSchema } from "./product";
import { jobApplicationSchema } from "./jobApplication";
import { jobPostingSchema } from "./jobPosting";
import { siteSettingsSchema } from "./siteSettings";

export const schemaTypes = [
  locationSchema,
  promotionSchema,
  productSchema,
  jobApplicationSchema,
  jobPostingSchema,
  siteSettingsSchema,
];

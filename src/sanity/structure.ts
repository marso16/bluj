import type { StructureBuilder } from "sanity/structure";

export const structure = (S: StructureBuilder) =>
  S.list()
    .title("BluJ CMS")
    .items([
      S.documentTypeListItem("location").title("Locations"),
      S.documentTypeListItem("promotion").title("Promotions"),
      S.documentTypeListItem("product").title("Products"),
      S.divider(),
      S.documentTypeListItem("post").title("News Posts"),
      S.documentTypeListItem("weeklySpecial").title("Weekly Specials"),
      S.documentTypeListItem("jobPosting").title("Job Postings"),
      S.documentTypeListItem("jobApplication").title("Job Applications"),
      S.documentTypeListItem("newsletterSubscriber").title("Newsletter Subscribers"),
      S.divider(),
      S.documentTypeListItem("siteSettings").title("Site Settings"),
    ]);

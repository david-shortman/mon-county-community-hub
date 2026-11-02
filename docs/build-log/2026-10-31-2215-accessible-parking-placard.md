# 2026-10-31: Accessible parking placard, from the DMV's PDF form

- **Considered:** the next PDF for #393. The parking page (#1030) says you need a state placard to use accessible spaces, but how to get one lives only in the WV DMV's two-page fillable PDF, DMV-41-TR. Its text layer drops words, so it is hard to read or search on a phone.
- **Chose:** `/accessible-parking-placard/`, built from a new `content/pdf-pages/wvdmv-accessible-parking.yaml` record with the FromPdf component. It quotes the six conditions a medical provider can certify, permanent and temporary placards, the four filling-out steps, where to mail it and the phone number, how to use the placard, the $5.00 replacement, and when to give it back. The form was read as an image at 200 dpi where the text layer was cut off. Two facts the form does not print (permanent placards last for life, and the ID card you must carry) are quoted from WV Code 17C-13-6, which the form names.
- **Left off:** a fee for a first placard, because neither the form nor the DMV page lists one; the page says so instead of saying it is free. The organization version of the form (DMV-41a-TR) is not covered.
- **Cost:** $0.

# 2026-10-30: Hide "Pass it on" with a record flag on safety listings

- **Considered:** the "Pass it on" row (Text, Print, Share) is left off domestic and sexual violence listings, because a text or share leaves a trace on the phone. It decided that from one org slug or words in the title, so a new safety listing with a neutral title would still show it (#555).
- **Chose:** a `private_trace: true` flag on the record, read by resource, place and calendar cards. The old org and title check stays as a backup, so nothing gets less safe.
- **Shipped:** the flag, its check, the README line, and the flag on the RDVIC hotline.

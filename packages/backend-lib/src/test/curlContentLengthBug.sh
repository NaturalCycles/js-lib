#!/usr/bin/env sh

# ./src/test/curlContentLengthBug.sh

curl \
 -X POST \
 --compressed \
 -v -H "Accept-Encoding: gzip" \
 -H "Content-Length: 6800" \
 -H "Content-Type: application/json;charset=utf-8" \
 -H "Host: example.com" \
 -H "User-Agent: SendGrid Event API" \
 -H "X-Forwarded-For: 167.89.117.25, 172.31.27.150" \
 -H "X-Forwarded-Port: 443" \
 -H "X-Forwarded-Proto: https" \
 -H "X-Real-Ip: 172.31.27.150" \
 --data "[{\"category\":[\"policy_update\"],\"smtp-id\":\"<ZqRSl715RJGxvIiI_9zThg@ismtpd0005p1lon1.sendgrid.net>\",\"sg_event_id\":\"ZGVmZXJyZWQtNDUtMTM3NTAzMy1acVJTbDcxNVJKR3h2SWlJXzl6VGhnLTA\",\"attempt\":\"45\",\"sg_template_id\":\"d-ac172b826c8f45ab9abcb393ba9e4205\",\"timestamp\":1565856095,\"sg_template_name\":\"Version 5\",\"event\":\"deferred\",\"email\":\"anonymized_d4slfjct8gc6el63@nc.com\",\"tls\":0,\"sg_message_id\":\"ZqRSl715RJGxvIiI_9zThg.filter0168p3mdw1-2269-5D52BCE3-5F.0\",\"response\":\"Email was deferred due to the following reason(s): [IPs were throttled by recipient server]: Email was deferred due to the following reason(s): [IPs were throttled by recipient server]\"}]" \
 "http://localhost:8080/api/v3/emailHooks/sendgrid"

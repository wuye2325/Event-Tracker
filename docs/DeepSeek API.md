# 1. API key：eed4801c-ca75-4b6e-ab90-4ebe4d331c07
# 2.请参考如下示例代码进行调用：

import os
from volcenginesdkarkruntime import Ark

# 请确保您已将 API Key 存储在环境变量 ARK_API_KEY 中
# 初始化Ark客户端，从环境变量中读取您的API Key
client = Ark(
    # 此为默认路径，您可根据业务所在地域进行配置
    base_url="https://ark.cn-beijing.volces.com/api/v3",
    # 从环境变量中获取您的 API Key。此为默认方式，您可根据需要进行修改
    api_key=os.environ.get("ARK_API_KEY"),
)

# Non-streaming:
print("----- standard request -----")
completion = client.chat.completions.create(
   # 指定您创建的方舟推理接入点 ID，此处已帮您修改为您的推理接入点 ID
    model="ep-20250217102422-4k9db",
    messages=[
        {"role": "system", "content": "你是人工智能助手."},
        {"role": "user", "content": "常见的十字花科植物有哪些？"},
    ],
)
print(completion.choices[0].message.content)

# Streaming:
print("----- streaming request -----")
stream = client.chat.completions.create(
    model="ep-20250217102422-4k9db",
    messages=[
        {"role": "system", "content": "你是人工智能助手."},
        {"role": "user", "content": "常见的十字花科植物有哪些？"},
    ],
    # 响应内容是否流式返回
    stream=True,
)
for chunk in stream:
    if not chunk.choices:
        continue
    print(chunk.choices[0].delta.content, end="")
print()
  }'
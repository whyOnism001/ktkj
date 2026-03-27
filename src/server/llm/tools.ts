import type OpenAI from 'openai'

export const tools: OpenAI.ChatCompletionTool[] = [
  {
    type: 'function',
    function: {
      name: 'search_catalog',
      description: '在服务目录中搜索匹配的服务。在推荐任何服务之前必须先调用此工具。',
      parameters: {
        type: 'object',
        properties: {
          query: {
            type: 'string',
            description: '搜索关键词，例如服务名称、类型、功能描述等'
          }
        },
        required: ['query']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'add_quote_item',
      description: '向当前报价单中添加一个服务项目',
      parameters: {
        type: 'object',
        properties: {
          serviceCode: {
            type: 'string',
            description: '服务代码，从 search_catalog 返回的 code 字段获取'
          },
          quantity: {
            type: 'number',
            description: '数量（根据服务单位，如台数、套数、GB等）'
          },
          configDesc: {
            type: 'string',
            description: '配置描述，详细说明配置信息，例如"4核8G，100GB SSD系统盘"'
          },
          months: {
            type: 'number',
            description: '服务月数，如不指定则使用报价单默认月数'
          }
        },
        required: ['serviceCode', 'quantity']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'update_quote_item',
      description: '更新报价单中某项服务的数量、配置描述或月数',
      parameters: {
        type: 'object',
        properties: {
          index: {
            type: 'number',
            description: '报价单中的项目索引（从0开始）'
          },
          quantity: {
            type: 'number',
            description: '新的数量'
          },
          configDesc: {
            type: 'string',
            description: '新的配置描述'
          },
          months: {
            type: 'number',
            description: '新的月数'
          }
        },
        required: ['index']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'remove_quote_item',
      description: '从报价单中删除一个服务项目',
      parameters: {
        type: 'object',
        properties: {
          index: {
            type: 'number',
            description: '报价单中的项目索引（从0开始）'
          }
        },
        required: ['index']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'match_external_list',
      description: '将来自其他云服务商（如阿里云、华为云、腾讯云等）的服务列表匹配到本地服务目录',
      parameters: {
        type: 'object',
        properties: {
          items: {
            type: 'array',
            description: '需要匹配的服务列表',
            items: {
              type: 'object',
              properties: {
                name: {
                  type: 'string',
                  description: '服务名称'
                },
                specs: {
                  type: 'string',
                  description: '服务规格描述（可选）'
                }
              },
              required: ['name']
            }
          }
        },
        required: ['items']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'generate_quote',
      description: '生成并显示当前报价单汇总。只有在用户确认所有项目都已添加后才调用此工具。',
      parameters: {
        type: 'object',
        properties: {}
      }
    }
  }
]

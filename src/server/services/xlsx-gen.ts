import ExcelJS from 'exceljs'
import type { Quote } from '../types'

export async function generateXlsxBuffer(quote: Quote): Promise<Buffer> {
  const workbook = new ExcelJS.Workbook()
  workbook.creator = '开投智云 AI 报价助手'
  workbook.created = new Date()

  const sheet = workbook.addWorksheet('报价单', {
    pageSetup: {
      paperSize: 9, // A4
      orientation: 'landscape',
      fitToPage: true,
      fitToWidth: 1,
      fitToHeight: 0
    }
  })

  // Column widths
  sheet.columns = [
    { key: 'seq', width: 6 },
    { key: 'category', width: 14 },
    { key: 'name', width: 28 },
    { key: 'specs', width: 32 },
    { key: 'unit', width: 8 },
    { key: 'unitPrice', width: 14 },
    { key: 'quantity', width: 8 },
    { key: 'months', width: 8 },
    { key: 'subtotal', width: 16 },
    { key: 'discountable', width: 10 }
  ]

  const BLUE_DARK = '1F3864'
  const BLUE_MID = '2E75B6'
  const BLUE_LIGHT = 'DEEAF1'
  const GREEN_LIGHT = 'E2EFDA'
  const YELLOW_LIGHT = 'FFF2CC'
  const ORANGE = 'C55A11'
  const WHITE = 'FFFFFF'
  const GRAY_LIGHT = 'F2F2F2'

  const totalCols = 10

  const applyBorders = (cell: ExcelJS.Cell, style: ExcelJS.BorderStyle = 'thin') => {
    cell.border = {
      top: { style, color: { argb: 'FF8DB3D5' } },
      left: { style, color: { argb: 'FF8DB3D5' } },
      bottom: { style, color: { argb: 'FF8DB3D5' } },
      right: { style, color: { argb: 'FF8DB3D5' } }
    }
  }

  const mergeAndStyle = (
    row: ExcelJS.Row,
    startCol: number,
    endCol: number,
    value: string,
    opts: {
      bold?: boolean
      fontSize?: number
      color?: string
      bgColor?: string
      align?: ExcelJS.Alignment['horizontal']
      wrapText?: boolean
    } = {}
  ) => {
    sheet.mergeCells(row.number, startCol, row.number, endCol)
    const cell = row.getCell(startCol)
    cell.value = value
    cell.font = {
      bold: opts.bold ?? false,
      size: opts.fontSize ?? 11,
      color: { argb: `FF${opts.color ?? '000000'}` },
      name: '微软雅黑'
    }
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: `FF${opts.bgColor ?? WHITE}` }
    }
    cell.alignment = {
      horizontal: opts.align ?? 'center',
      vertical: 'middle',
      wrapText: opts.wrapText ?? false
    }
    applyBorders(cell)
  }

  // ROW 1: Big title
  const r1 = sheet.addRow([])
  r1.height = 45
  mergeAndStyle(r1, 1, totalCols, '开投智云云服务报价单', {
    bold: true,
    fontSize: 18,
    color: WHITE,
    bgColor: BLUE_DARK,
    align: 'center'
  })

  // ROW 2: Meta info
  const r2 = sheet.addRow([])
  r2.height = 22
  const metaLeftText = `项目名称：${quote.projectName || '—'}    客户单位：${quote.clientOrg || '—'}`
  sheet.mergeCells(r2.number, 1, r2.number, 6)
  const metaLeft = r2.getCell(1)
  metaLeft.value = metaLeftText
  metaLeft.font = { bold: true, size: 10, name: '微软雅黑', color: { argb: `FF${BLUE_DARK}` } }
  metaLeft.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: `FF${BLUE_LIGHT}` } }
  metaLeft.alignment = { horizontal: 'left', vertical: 'middle', indent: 1 }
  applyBorders(metaLeft)

  const metaRightText = `服务商：${quote.providerOrg || '开投智云'}    报价日期：${new Date().toLocaleDateString('zh-CN')}`
  sheet.mergeCells(r2.number, 7, r2.number, totalCols)
  const metaRight = r2.getCell(7)
  metaRight.value = metaRightText
  metaRight.font = { bold: true, size: 10, name: '微软雅黑', color: { argb: `FF${BLUE_DARK}` } }
  metaRight.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: `FF${BLUE_LIGHT}` } }
  metaRight.alignment = { horizontal: 'right', vertical: 'middle', indent: 1 }
  applyBorders(metaRight)

  // ROW 3: Sub meta
  const r3 = sheet.addRow([])
  r3.height = 20
  const subMeta = `服务周期：${quote.months || 1}个月    折扣率：${quote.discountRate || 100}%`
  sheet.mergeCells(r3.number, 1, r3.number, totalCols)
  const subMetaCell = r3.getCell(1)
  subMetaCell.value = subMeta
  subMetaCell.font = { size: 10, name: '微软雅黑', italic: true, color: { argb: `FF${BLUE_MID}` } }
  subMetaCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFAF7F0' } }
  subMetaCell.alignment = { horizontal: 'right', vertical: 'middle', indent: 2 }
  applyBorders(subMetaCell)

  // ROW 4: Spacer
  sheet.addRow([]).height = 4

  // ROW 5: Table header
  const headers = ['序号', '类别', '服务名称', '规格/配置', '单位', '单价(元)', '数量', '月数', '小计(元)', '是否折扣']
  const headerRow = sheet.addRow(headers)
  headerRow.height = 28
  headerRow.eachCell((cell) => {
    cell.font = { bold: true, size: 10, name: '微软雅黑', color: { argb: `FF${WHITE}` } }
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: `FF${BLUE_MID}` } }
    cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: false }
    applyBorders(cell, 'medium')
  })

  // Data rows
  let rowIndex = 0
  for (const item of quote.items) {
    rowIndex++
    const isEven = rowIndex % 2 === 0
    const rowBg = isEven ? GRAY_LIGHT : WHITE
    const specText = item.configDesc ? `${item.specs}\n${item.configDesc}` : item.specs

    const dataRow = sheet.addRow([
      rowIndex,
      getCategoryFromCode(item.serviceCode),
      item.serviceName,
      specText,
      getUnitFromSpecs(item.specs),
      item.unitPrice,
      item.quantity,
      item.months,
      item.subtotal,
      item.discountable ? '是' : '否'
    ])
    dataRow.height = item.configDesc ? 36 : 22

    dataRow.eachCell((cell, col) => {
      cell.font = { size: 10, name: '微软雅黑' }
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: `FF${rowBg}` } }
      applyBorders(cell)

      if (col === 1 || col === 5 || col === 7 || col === 8 || col === 10) {
        cell.alignment = { horizontal: 'center', vertical: 'middle' }
      } else if (col === 3 || col === 4) {
        cell.alignment = { horizontal: 'left', vertical: 'middle', wrapText: true, indent: 1 }
      } else if (col === 6 || col === 9) {
        cell.alignment = { horizontal: 'right', vertical: 'middle' }
        cell.numFmt = '#,##0.00'
      } else {
        cell.alignment = { horizontal: 'left', vertical: 'middle', indent: 1 }
      }

      if (col === 10 && !item.discountable) {
        cell.font = { size: 10, name: '微软雅黑', color: { argb: `FF${ORANGE}` }, bold: true }
      }
    })
  }

  // Spacer row
  sheet.addRow([]).height = 6

  // Summary section
  const addSummaryRow = (
    label: string,
    value: string,
    labelBg: string,
    valueBg: string,
    bold = false
  ) => {
    const row = sheet.addRow([])
    row.height = 24

    sheet.mergeCells(row.number, 1, row.number, 7)
    const labelCell = row.getCell(1)
    labelCell.value = label
    labelCell.font = { bold, size: 11, name: '微软雅黑' }
    labelCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: `FF${labelBg}` } }
    labelCell.alignment = { horizontal: 'right', vertical: 'middle', indent: 2 }
    applyBorders(labelCell)

    sheet.mergeCells(row.number, 8, row.number, totalCols)
    const valueCell = row.getCell(8)
    valueCell.value = value
    valueCell.font = {
      bold,
      size: 12,
      name: '微软雅黑',
      color: { argb: bold ? `FF${ORANGE}` : `FF${BLUE_DARK}` }
    }
    valueCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: `FF${valueBg}` } }
    valueCell.alignment = { horizontal: 'right', vertical: 'middle', indent: 2 }
    applyBorders(valueCell)
  }

  addSummaryRow('原价合计：', `¥ ${formatMoney(quote.totalBeforeDiscount)}`, BLUE_LIGHT, BLUE_LIGHT)
  addSummaryRow(
    `折扣率：${quote.discountRate || 100}%（不参与折扣的项目按原价计算）`,
    `${quote.discountRate || 100}%`,
    YELLOW_LIGHT,
    YELLOW_LIGHT
  )
  addSummaryRow(
    '折后合计（含税）：',
    `¥ ${formatMoney(quote.totalAfterDiscount)}`,
    GREEN_LIGHT,
    GREEN_LIGHT,
    true
  )

  // Footer note
  const noteRow = sheet.addRow([])
  noteRow.height = 40
  sheet.mergeCells(noteRow.number, 1, noteRow.number, totalCols)
  const noteCell = noteRow.getCell(1)
  noteCell.value =
    '备注：本报价单由开投智云AI报价助手自动生成，价格仅供参考，最终以合同为准。互联网带宽、公网IP等标注"否"的项目不参与折扣优惠。'
  noteCell.font = { size: 9, name: '微软雅黑', italic: true, color: { argb: 'FF808080' } }
  noteCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF9F9F9' } }
  noteCell.alignment = { horizontal: 'left', vertical: 'middle', wrapText: true, indent: 1 }
  applyBorders(noteCell)

  const buffer = await workbook.xlsx.writeBuffer()
  return Buffer.from(buffer)
}

function getCategoryFromCode(code: string): string {
  const categoryMap: Record<string, string> = {
    server: '推荐服务',
    host_security: '安全服务',
    log_audit: '安全服务',
    bastion: '安全服务',
    waf: '安全服务',
    cloud_firewall: '安全服务',
    vul_scan: '安全服务',
    db_audit: '安全服务',
    web_tamper: '安全服务',
    ddos: '安全服务',
    web_monitor: '安全服务',
    bandwidth_lt5: '网络服务',
    bandwidth_5to10: '网络服务',
    bandwidth_gt10: '网络服务',
    public_ip: '网络服务',
    nat: '网关服务',
    vpn: '网关服务',
    container: '容器服务',
    storage_sas: '存储服务',
    storage_ssd: '存储服务',
    storage_obs: '存储服务',
    snapshot: '备份服务',
    backup: '备份服务',
    redis_master: '缓存服务',
    redis_cluster: '缓存服务',
    db_enterprise: '数据库服务',
    db_newsql_std: '数据库服务',
    db_newsql_perf: '数据库服务',
    bigdata_flume: '大数据服务',
    bigdata_redis: '大数据服务',
    bigdata_suite: '大数据服务',
    bigdata_kafka: '大数据服务',
    dws: '大数据服务',
    datagov_api: '数据治理',
    datagov_task: '数据治理',
    datagov_asset: '数据治理',
    video_access: '视频服务',
    video_ai_high: '视频服务',
    video_ai_basic: '视频服务',
    saas_identity: 'SaaS服务',
    saas_portal: 'SaaS服务',
    saas_clouddisk: 'SaaS服务',
    ops_vul: '运维服务',
    ops_drill: '运维服务',
    ops_guard: '运维服务'
  }

  return categoryMap[code] || '其他服务'
}

function getUnitFromSpecs(specs: string): string {
  const match = specs.match(/按([^,，/]+)计费/)
  if (match) return match[1]
  return '套'
}

function formatMoney(amount: number): string {
  return amount.toLocaleString('zh-CN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
}

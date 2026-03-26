// 服务数据配置（重构版）
// billingType: 'monthly' 按月计费 | 'yearly' 按年计费
const servicesData = {
    '推荐服务': [
        {
            type: 'server',
            name: '云主机',
            code: 'server',
            desc: '计算资源配置，支持预设和自定义',
            presets: [
                { name: '1核2G', cpu: 1, memory: 2 },
                { name: '2核4G', cpu: 2, memory: 4 },
                { name: '2核8G', cpu: 2, memory: 8 },
                { name: '4核8G', cpu: 4, memory: 8 },
                { name: '4核16G', cpu: 4, memory: 16 },
                { name: '8核16G', cpu: 8, memory: 16 },
                { name: '8核32G', cpu: 8, memory: 32 },
                { name: '16核32G', cpu: 16, memory: 32 },
                { name: '16核64G', cpu: 16, memory: 64 },
                { name: '32核64G', cpu: 32, memory: 64 },
                { name: '32核128G', cpu: 32, memory: 128 }
            ],
            cpuPrice: 30,
            memoryPrice: 19.5,
            discount: true,
            recommend: true,
            billingType: 'monthly'
        },
        {
            name: '主机安全服务',
            code: 'host_security',
            unit: '套',
            price: 112.5,
            discount: true,
            desc: '提升主机整体安全性，1套=1个云主机',
            recommend: true,
            critical: true,
            billingType: 'monthly'
        },
        {
            name: '综合日志审计服务',
            code: 'log_audit',
            unit: '套',
            price: 119,
            discount: true,
            desc: '1套=1个主机，日志存储量3T',
            recommend: true,
            billingType: 'monthly'
        },
        {
            name: '云堡垒机服务',
            code: 'bastion',
            unit: '套',
            price: 793,
            discount: true,
            desc: '1套=10个资产，统一账户管理和权限控制',
            recommend: true,
            billingType: 'monthly'
        },
        {
            name: 'Web应用防火墙服务-100Mbps',
            code: 'waf',
            unit: '套',
            price: 3450,
            discount: true,
            desc: 'HTTP流量≤100Mbps，SQL注入、XSS等攻击防护',
            recommend: true,
            critical: true,
            billingType: 'monthly'
        },
        {
            name: '云防火墙-1GB吞吐量',
            code: 'cloud_firewall',
            unit: '套',
            price: 2800,
            discount: true,
            desc: '边界防火墙，入侵检测防御',
            recommend: true,
            billingType: 'monthly'
        },
        {
            name: '漏洞扫描服务-1IP数量',
            code: 'vul_scan',
            unit: '套',
            price: 650,
            discount: true,
            desc: '多维度安全检测',
            recommend: true,
            billingType: 'monthly'
        },
        {
            name: '数据库审计服务',
            code: 'db_audit',
            unit: '套',
            price: 1275,
            discount: true,
            desc: '1套=1个数据库实例',
            recommend: true,
            billingType: 'monthly'
        },
        {
            name: '互联网带宽',
            code: 'bandwidth',
            unit: 'M',
            price: 0,
            discount: false,
            desc: '自动分段计费，不参与折扣',
            recommend: true,
            type: 'bandwidth',
            billingType: 'monthly'
        },
        {
            name: '公网IP',
            code: 'public_ip',
            unit: '个',
            price: 40,
            discount: false,
            desc: '不参与折扣',
            recommend: true,
            billingType: 'monthly'
        }
    ],
    '容器服务': [
        { name: '云原生基础容器引擎', code: 'container', unit: '50节点', price: 546, discount: true, desc: '提供容器编排、调度、部署等能力', billingType: 'monthly' }
    ],
    '存储服务': [
        { name: '分布式块存储-高IO-SAS', code: 'storage_sas', unit: 'GB', price: 0.3, discount: true, desc: 'SAS级块存储，纠删码校验', billingType: 'monthly' },
        { name: '分布式块存储-超高IO-SSD', code: 'storage_ssd', unit: 'GB', price: 1.2, discount: true, desc: 'SSD级块存储，纠错码校验', billingType: 'monthly' },
        { name: 'OBS对象存储-T', code: 'storage_obs', unit: 'GB', price: 0.09, discount: true, desc: '海量对象存储服务', billingType: 'monthly' }
    ],
    '备份服务': [
        { name: '云硬盘快照', code: 'snapshot', unit: 'GB', price: 0.32, discount: true, desc: '基于快照创建新云硬盘', billingType: 'monthly' },
        { name: '备份', code: 'backup', unit: 'GB', price: 0.32, discount: true, desc: '数据库、文件、应用备份', billingType: 'monthly' }
    ],
    '安全服务': [
        { name: 'Web应用防火墙服务-100Mbps', code: 'waf', unit: '套', price: 3450, discount: true, desc: 'HTTP流量≤100Mbps防护', billingType: 'monthly' },
        { name: '云防火墙-1GB吞吐量', code: 'cloud_firewall', unit: '套', price: 2800, discount: true, desc: '边界防火墙，入侵检测防御', billingType: 'monthly' },
        { name: '漏洞扫描服务-1IP数量', code: 'vul_scan', unit: '套', price: 650, discount: true, desc: '多维度安全检测', billingType: 'monthly' },
        { name: '主机安全服务', code: 'host_security', unit: '套', price: 112.5, discount: true, desc: '1套=1个云主机', billingType: 'monthly' },
        { name: '云堡垒机服务', code: 'bastion', unit: '套', price: 793, discount: true, desc: '1套=10个资产', billingType: 'monthly' },
        { name: '数据库审计服务', code: 'db_audit', unit: '套', price: 1275, discount: true, desc: '1套=1个数据库实例', billingType: 'monthly' },
        { name: '网页防篡改服务', code: 'web_tamper', unit: '套', price: 1050, discount: true, desc: '1套=1个主机', billingType: 'monthly' },
        { name: 'DDoS流量清洗', code: 'ddos', unit: '10M', price: 350, discount: true, desc: 'DDoS攻击防护', billingType: 'monthly' },
        { name: '综合日志审计服务-1日志源', code: 'log_audit', unit: '套', price: 119, discount: true, desc: '1套=1个主机', billingType: 'monthly' },
        { name: '互联网应用云安全监测', code: 'web_monitor', unit: '个系统', price: 500, discount: true, desc: '24小时安全监测', billingType: 'monthly' }
    ],
    '网关服务': [
        { name: 'NAT网关(小型)', code: 'nat', unit: '套', price: 267.6, discount: true, desc: '网络地址转换服务', billingType: 'monthly' },
        { name: 'VPN网关', code: 'vpn', unit: '并发', price: 40, discount: true, desc: '零信任防火墙', billingType: 'monthly' }
    ],
    '缓存服务': [
        { name: '分布式缓存服务(Redis)-主备版', code: 'redis_master', unit: 'GB', price: 75, discount: true, desc: '主备节点实时复制（固定2节点）', billingType: 'monthly', type: 'redis_master' },
        { name: '分布式缓存服务(Redis)-集群版', code: 'redis_cluster', unit: 'GB', price: 127.5, discount: true, desc: '条带化分区（3的倍数节点）', billingType: 'monthly', type: 'redis_cluster' }
    ],
    '数据库服务': [
        { name: '企业级分布式关系型数据库-4核16G', code: 'db_enterprise', unit: '套', price: 6000, discount: true, desc: '国产化主流数据库', billingType: 'monthly' },
        { name: '自研分布式NewSQL数据库-标准版', code: 'db_newsql_std', unit: '套', price: 3500, discount: true, desc: '标准版，读写分离', billingType: 'monthly' },
        { name: '自研分布式NewSQL数据库-高性能版', code: 'db_newsql_perf', unit: '套', price: 6000, discount: true, desc: '高性能版，独立三节点', billingType: 'monthly' }
    ],
    '大数据服务': [
        { name: '大数据基础服务-Flume', code: 'bigdata_flume', unit: '次', price: 2381, discount: true, desc: '日志采集、聚合和传输', billingType: 'monthly' },
        { name: '大数据基础服务-Redis', code: 'bigdata_redis', unit: '套', price: 4762, discount: true, desc: '每6个实例', billingType: 'monthly' },
        { name: '大数据基础服务-(Hive+Spark+Hetu+Flink+Mapreduce+TEZ)', code: 'bigdata_suite', unit: '套', price: 5952, discount: true, desc: '每24vCPU', billingType: 'monthly' },
        { name: '大数据基础服务-Kafka', code: 'bigdata_kafka', unit: '次', price: 2267, discount: true, desc: '消息发布-订阅系统', billingType: 'monthly' },
        { name: 'DWS数据仓库服务', code: 'dws', unit: '套', price: 13244, discount: true, desc: '每24vCPU', billingType: 'monthly' }
    ],
    '数据治理': [
        { name: '数据治理工具服务-每5API数', code: 'datagov_api', unit: '套', price: 952, discount: true, desc: '每5个API', billingType: 'monthly' },
        { name: '数据治理工具服务-每100任务数', code: 'datagov_task', unit: '套', price: 952, discount: true, desc: '每100个任务', billingType: 'monthly' },
        { name: '数据治理工具服务-每200资产数', code: 'datagov_asset', unit: '套', price: 952, discount: true, desc: '每200个资产', billingType: 'monthly' }
    ],
    '视频服务': [
        { name: '平台接入服务', code: 'video接入', unit: '路', price: 8, discount: true, desc: '视频平台接入', billingType: 'monthly' },
        { name: 'AI算法-高阶分析算法服务', code: 'video_ai_high', unit: '路', price: 180, discount: true, desc: '高级视频分析', billingType: 'monthly' },
        { name: 'AI算法-基础分析算法服务', code: 'video_ai_basic', unit: '路', price: 120, discount: true, desc: '基础视频分析', billingType: 'monthly' }
    ],
    'SaaS服务': [
        { name: '身份识别与访问控制系统', code: 'saas_identity', unit: '套', price: 17000, discount: true, desc: '1套/年', billingType: 'yearly' },
        { name: '对内门户用户授权', code: 'saas_portal', unit: '个', price: 140, discount: false, desc: '1个/年，不参与折扣', billingType: 'yearly' },
        { name: '企业云盘', code: 'saas_clouddisk', unit: '用户', price: 300, discount: true, desc: '1用户/年', billingType: 'yearly' }
    ],
    '网络服务': [
        { name: '公网IP', code: 'public_ip', unit: '个', price: 40, discount: false, desc: '不参与折扣', billingType: 'monthly' },
        { name: '互联网带宽', code: 'bandwidth', unit: 'M', price: 0, discount: false, desc: '自动分段计费，不参与折扣', type: 'bandwidth', billingType: 'monthly' }
    ],
    '运维服务': [
        { name: '风险验证与协同处置', code: 'ops_vul', unit: '套', price: 40000, discount: true, desc: '1套/年', billingType: 'yearly' },
        { name: '应急演练', code: 'ops_drill', unit: '次', price: 15000, discount: true, desc: '安全事件演练', billingType: 'yearly' },
        { name: '重保驻场值守', code: 'ops_guard', unit: '次', price: 12600, discount: true, desc: '24小时驻场7天', billingType: 'yearly' }
    ]
};

// 存储配置价格
const storageConfig = {
    'SAS': { name: '高IO-SAS', price: 0.3, unit: 'GB/月' },
    'SSD': { name: '超高IO-SSD', price: 1.2, unit: 'GB/月' }
};

// 保存配置
const STORAGE_KEY = 'ktjk_calculator_configs';

// 全局状态
let state = {
    discountRate: 85,  // 折扣率（0-100，0表示不打折）
    month: 1,
    selectedServices: [],
    currentCategory: '推荐服务',
    serverConfig: {
        cpu: 0,
        memory: 0,
        quantity: 1,
        preset: null,
        storageDisks: [] // 支持多个存储盘：[{type: 'SSD', size: 100}, {type: 'SAS', size: 200}]
    },
    bandwidthConfig: {
        size: 0
    },
    redisConfig: {
        masterNodes: 2,    // 主备版固定2节点
        clusterNodes: 3    // 集群版节点数（默认3，3的倍数）
    }
};

// 初始化
function init() {
    renderCategoryTabs();
    renderServicesList();
    renderRecommendBar();
    setupEventListeners();
    updateResult();
    loadTheme();

    // 绑定涟漪效果到动态生成的按钮
    setTimeout(() => {
        bindRippleEffectToButtons();
        // 页面就绪欢迎动画
        setTimeout(() => {
            showWelcomeAnimation();
        }, 500);
    }, 100);
}

// 渲染推荐栏
function renderRecommendBar() {
    const recommendList = document.getElementById('recommendList');
    const recommendServices = servicesData['推荐服务'];

    recommendList.innerHTML = recommendServices.map(service => {
        const isAdded = state.selectedServices.some(s => s.code === service.code);
        const classes = [
            'recommend-item',
            service.critical ? 'critical' : '',
            isAdded ? 'has-added' : ''
        ].filter(Boolean).join(' ');

        return `
            <div class="${classes}" onclick="addRecommendService('${service.code}')"
                 title="${service.desc}">
                ${service.critical ? '🚨' : '⭐'} ${service.name}
            </div>
        `;
    }).join('');
}

// 渲染分类标签
function renderCategoryTabs() {
    const tabs = document.getElementById('categoryTabs');
    const categories = Object.keys(servicesData);

    tabs.innerHTML = categories.map(category => `
        <div class="category-tab ${category === state.currentCategory ? 'active' : ''}"
             onclick="switchCategory('${category}')">
            ${category}
        </div>
    `).join('');
}

// 渲染服务列表
function renderServicesList() {
    const list = document.getElementById('servicesList');
    const services = servicesData[state.currentCategory];

    let html = '';

    // 如果是推荐服务，渲染云主机配置器和带宽配置器
    if (state.currentCategory === '推荐服务') {
        const serverConfig = services.find(s => s.type === 'server');
        if (serverConfig) {
            html += renderServerConfigurator(serverConfig);
        }

        const bandwidthService = services.find(s => s.type === 'bandwidth');
        if (bandwidthService) {
            html += renderBandwidthConfigurator(bandwidthService);
        }
    }

    // 如果是缓存服务，渲染Redis配置器
    if (state.currentCategory === '缓存服务') {
        const redisMaster = services.find(s => s.type === 'redis_master');
        const redisCluster = services.find(s => s.type === 'redis_cluster');

        if (redisMaster) {
            html += renderRedisConfigurator(redisMaster, 'master');
        }
        if (redisCluster) {
            html += renderRedisConfigurator(redisCluster, 'cluster');
        }
    }

    // 渲染其他服务
    const servicesList = services || [];
    servicesList.forEach((service, index) => {
        // 跳过云主机（已单独渲染）、带宽（type='bandwidth'）、Redis缓存（需配置器）
        if (service.type === 'server' || service.type === 'bandwidth' ||
            service.type === 'redis_master' || service.type === 'redis_cluster') return;

        const isSelected = state.selectedServices.some(s => s.code === service.code);

        html += `
            <div class="service-card ${isSelected ? 'selected' : ''}">
                <div class="service-header">
                    <div class="service-name">
                        ${service.name}
                        ${service.recommend ? '<span class="badge badge-recommend">推荐</span>' : ''}
                    </div>
                    <div class="service-badges">
                        ${service.discount ? '<span class="badge badge-discount">85折</span>' : '<span class="badge badge-no-discount">不折</span>'}
                    </div>
                </div>
                <div class="service-desc">${service.desc}</div>
                <div class="service-info">
                    <span>单价：¥${service.price.toFixed(2)}/${service.unit}</span>
                    <span class="service-price">${service.discount ? '可折扣' : '原价'}</span>
                </div>
                <div class="service-input">
                    <input type="number"
                           min="0"
                           step="1"
                           placeholder="数量"
                           id="input-${service.code}"
                           value="${getQuantity(service.code)}">
                    <span>${service.unit}</span>
                    <button class="add-btn ${isSelected ? 'added' : ''} ${service.critical ? 'critical' : ''}"
                            onclick="toggleService('${service.code}')">
                        ${isSelected ? '✓' : '+'}
                    </button>
                </div>
            </div>
        `;
    });

    list.innerHTML = html;

    // 绑定涟漪效果到新生成的服务卡片和按钮
    setTimeout(() => {
        bindRippleEffectToButtons();
    }, 50);
}

// 渲染云主机配置器（支持SSD+SAS混合存储）
function renderServerConfigurator(config) {
    const { presets, cpuPrice, memoryPrice, discount } = config;
    const { cpu, memory, quantity, preset, storageDisks } = state.serverConfig;

    // 计算当前配置价格
    const cpuPriceVal = (cpu || 0) * cpuPrice;
    const memoryPriceVal = (memory || 0) * memoryPrice;

    // 计算所有存储盘的总价
    let storagePriceVal = 0;
    let storageSummary = '';
    if (storageDisks.length > 0) {
        storageDisks.forEach((disk, index) => {
            storagePriceVal += disk.size * storageConfig[disk.type].price;
        });

        // 生成存储摘要
        const sasDisks = storageDisks.filter(d => d.type === 'SAS');
        const ssdDisks = storageDisks.filter(d => d.type === 'SSD');
        const parts = [];
        if (sasDisks.length > 0) {
            const totalSas = sasDisks.reduce((sum, d) => sum + d.size, 0);
            parts.push(`${totalSas}GB SAS`);
        }
        if (ssdDisks.length > 0) {
            const totalSsd = ssdDisks.reduce((sum, d) => sum + d.size, 0);
            parts.push(`${totalSsd}GB SSD`);
        }
        storageSummary = parts.join(' + ');
    }

    const basePrice = (cpuPriceVal + memoryPriceVal + storagePriceVal) * quantity;
    const previewPrice = discount ? basePrice * 0.85 : basePrice;

    return `
        <div class="server-config-section">
            <div class="config-title">
                💻 云主机配置
                ${discount ? '<span class="badge badge-discount">85折</span>' : ''}
            </div>

            <!-- 预设配置 -->
            <div class="config-presets">
                ${presets.map(p => `
                    <div class="config-preset ${preset === p.name ? 'selected' : ''}"
                         onclick="selectPreset('${p.name}', ${p.cpu}, ${p.memory})">
                        ${p.name}
                    </div>
                `).join('')}
            </div>

            <!-- 自定义配置 -->
            <div class="config-custom">
                <div class="config-input-group">
                    <span>CPU:</span>
                    <input type="number"
                           id="cpuInput"
                           min="0"
                           value="${cpu || ''}"
                           placeholder="核"
                           onchange="updateCustomConfig('cpu', this.value)">
                    <span>核</span>
                </div>
                <div class="config-input-group">
                    <span>内存:</span>
                    <input type="number"
                           id="memoryInput"
                           min="0"
                           value="${memory || ''}"
                           placeholder="GB"
                           onchange="updateCustomConfig('memory', this.value)">
                    <span>GB</span>
                </div>
                <div class="config-input-group">
                    <span>数量:</span>
                    <input type="number"
                           id="quantityInput"
                           min="1"
                           value="${quantity}"
                           onchange="updateCustomConfig('quantity', this.value)">
                    <span>台</span>
                </div>
            </div>

            <!-- 存储类型选择 - 支持组合搭配 -->
            <div style="margin: var(--space-3) 0; padding-top: var(--space-3); border-top: 1px dashed var(--border-light);">
                <div style="font-size: 0.875rem; font-weight: 700; color: var(--text-secondary); margin-bottom: var(--space-2);">
                    💾 存储配置（支持SSD+SAS混合搭配）
                </div>

                <!-- 添加新的存储盘 -->
                <div class="config-custom" style="margin-bottom: var(--space-2);">
                    <div class="config-input-group">
                        <span>类型:</span>
                        <select id="newDiskType" style="padding: var(--space-2); border: 1px solid var(--border-light); border-radius: var(--radius-md);">
                            <option value="SAS">SAS</option>
                            <option value="SSD">SSD</option>
                        </select>
                    </div>
                    <div class="config-input-group">
                        <span>容量:</span>
                        <input type="number"
                               id="newDiskSize"
                               min="10"
                               step="10"
                               placeholder="GB"
                               style="width: 60px;">
                        <span>GB</span>
                    </div>
                    <button class="add-btn" onclick="addStorageDisk()">添加存储盘</button>
                </div>

                <!-- 已添加的存储盘列表 -->
                ${storageDisks.length > 0 ? `
                    <div style="margin: var(--space-2) 0; padding: var(--space-3); background: var(--primary-50); border-radius: var(--radius-md); font-size: 0.8125rem;">
                        <div style="font-weight: 700; color: var(--primary-700); margin-bottom: var(--space-2);">已配置存储盘：</div>
                        ${storageDisks.map((disk, idx) => `
                            <div style="display: flex; justify-content: space-between; align-items: center; padding: var(--space-1) 0;">
                                <span>${disk.type}: ${disk.size}GB (¥${(disk.size * storageConfig[disk.type].price).toFixed(2)}/月)</span>
                                <button onclick="removeStorageDisk(${idx})"
                                        style="background: var(--danger-500); color: white; border: none; border-radius: var(--radius-sm); width: 20px; height: 20px; font-size: 12px; cursor: pointer; line-height: 1;">×</button>
                            </div>
                        `).join('')}
                        <div style="margin-top: var(--space-2); padding-top: var(--space-2); border-top: 1px dashed var(--border-light); font-weight: 700; color: var(--primary-600);">
                            合计：${storageSummary} = ¥${storagePriceVal.toFixed(2)}/月
                        </div>
                    </div>
                ` : `
                    <div style="font-size: 0.8125rem; color: var(--text-tertiary); padding: var(--space-2);">
                        💡 提示：可添加多个存储盘，支持SSD和SAS混合使用
                    </div>
                `}
            </div>

            <div class="config-info">
                价格：CPU ¥${cpuPrice}/核/月 + 内存 ¥${memoryPrice}/GB/月
                ${storageDisks.length > 0 ? ` + 存储 ¥${storagePriceVal.toFixed(2)}/月` : ''}
                ${discount ? ' | 已应用85折优惠' : ''}
            </div>

            ${cpu > 0 && memory > 0 ? `
                <div class="price-estimate">
                    <div class="estimate-row">
                        <span>CPU费用：</span>
                        <span>¥${(cpuPriceVal * quantity).toFixed(2)}</span>
                    </div>
                    <div class="estimate-row">
                        <span>内存费用：</span>
                        <span>¥${(memoryPriceVal * quantity).toFixed(2)}</span>
                    </div>
                    ${storageDisks.length > 0 ? `
                        <div class="estimate-row">
                            <span>存储费用：</span>
                            <span>¥${(storagePriceVal * quantity).toFixed(2)}</span>
                        </div>
                    ` : ''}
                    <div class="estimate-row estimate-total">
                        <span>小计：</span>
                        <span>¥${basePrice.toFixed(2)}</span>
                    </div>
                    ${discount ? `
                        <div class="estimate-row" style="color: var(--success-500); font-weight: 700;">
                            <span>折后：</span>
                            <span>¥${previewPrice.toFixed(2)}</span>
                        </div>
                    ` : ''}
                </div>
            ` : ''}

            <div class="config-actions">
                <button class="add-btn ${cpu > 0 && memory > 0 ? '' : 'disabled'}"
                        onclick="addServerConfig()"
                        ${cpu > 0 && memory > 0 ? '' : 'disabled'}>
                    ${cpu > 0 && memory > 0 ? '✓ 添加云主机配置' : '请先配置CPU和内存'}
                </button>
            </div>
        </div>
    `;
}

// 渲染带宽配置器（自动分段计费）
function renderBandwidthConfigurator(service) {
    const { size } = state.bandwidthConfig;

    // 自动计算带宽价格
    let priceUnit = 0;
    let tierInfo = '';
    if (size > 0) {
        if (size < 5) {
            priceUnit = 13.6;
            tierInfo = `＜5M (¥13.6/M/月)`;
        } else if (size < 10) {
            priceUnit = 17;
            tierInfo = `5M-10M (¥17/M/月)`;
        } else {
            priceUnit = 25.5;
            tierInfo = `≥10M (¥25.5/M/月)`;
        }
    }

    const totalPrice = size * priceUnit;

    return `
        <div class="server-config-section" style="margin-top: var(--space-4);">
            <div class="config-title">
                🌐 带宽配置
                <span class="badge badge-no-discount">不参与折扣</span>
            </div>

            <div class="config-custom">
                <div class="config-input-group">
                    <span>带宽:</span>
                    <input type="number"
                           id="bandwidthInput"
                           min="1"
                           value="${size || ''}"
                           placeholder=" M"
                           onchange="updateBandwidthConfig(this.value)">
                    <span>M</span>
                </div>
            </div>

            ${size > 0 ? `
                <div class="config-info">
                    计费策略：${tierInfo}
                </div>
                <div class="price-estimate">
                    <div class="estimate-row">
                        <span>带宽费用：</span>
                        <span>¥${totalPrice.toFixed(2)}/月</span>
                    </div>
                </div>
                <div class="config-actions">
                    <button class="add-btn" onclick="addBandwidthConfig()">
                        ✓ 添加带宽配置
                    </button>
                </div>
            ` : `
                <div class="config-info">
                    请输入带宽值，系统将自动匹配分段计费
                </div>
                <div style="font-size: 0.8125rem; color: var(--text-tertiary); margin-top: var(--space-2);">
                    ≤5M: ¥13.6/M | 5M-10M: ¥17/M | ≥10M: ¥25.5/M
                </div>
            `}
        </div>
    `;
}

// 渲染Redis缓存配置器
function renderRedisConfigurator(service, type) {
    const { masterNodes, clusterNodes } = state.redisConfig;
    const { price, discount } = service;

    if (type === 'master') {
        // 主备版：固定2节点，单位价格 × 2
        const unitPrice = price * 2;  // 2节点
        const basePrice = unitPrice;  // 按GB/月计费，数量由用户输入
        const configName = '2节点主备';
        const capacity = getServiceRedisCapacity('redis_master');

        return `
            <div class="server-config-section" style="margin-top: var(--space-4);">
                <div class="config-title">
                    🔑 Redis主备版配置
                    ${discount ? '<span class="badge badge-discount">85折</span>' : ''}
                </div>

                <div class="config-info">
                    规格：主备双节点实时复制 | 单价：¥${price.toFixed(2)}/GB/月 × 2节点 = <strong style="color: var(--primary-600);">¥${unitPrice.toFixed(2)}/GB/月</strong>
                </div>

                <div class="config-custom" style="margin-top: var(--space-3);">
                    <div class="config-input-group">
                        <span>容量:</span>
                        <input type="number"
                               id="redisMasterInput"
                               min="1"
                               step="1"
                               placeholder="GB"
                               value="${capacity}">
                        <span>GB</span>
                    </div>
                </div>

                <div class="config-actions">
                    <button class="add-btn" onclick="addRedisConfig('master')">
                        ✓ 添加Redis主备服务
                    </button>
                </div>
            </div>
        `;
    } else {
        // 集群版：3的倍数个节点，单价 × 节点数
        const { price, discount } = service;
        const nodeCount = clusterNodes;
        const unitPrice = price * nodeCount;  // 每GB/月的价格
        const configName = `${nodeCount}节点集群`;
        const capacity = getServiceRedisCapacity('redis_cluster');

        return `
            <div class="server-config-section" style="margin-top: var(--space-4);">
                <div class="config-title">
                    🔑 Redis集群版配置
                    ${discount ? '<span class="badge badge-discount">85折</span>' : ''}
                </div>

                <div class="config-info">
                    规格：条带化分区集群 | 单价：¥${price.toFixed(2)}/GB/月 × ${nodeCount}节点 = <strong style="color: var(--primary-600);">¥${unitPrice.toFixed(2)}/GB/月</strong>
                </div>

                <div class="config-custom" style="margin-top: var(--space-3);">
                    <div class="config-input-group">
                        <span>节点数:</span>
                        <input type="number"
                               id="redisClusterNodes"
                               min="3"
                               step="3"
                               value="${clusterNodes}"
                               onchange="updateRedisClusterNodes(this.value)">
                        <span>个</span>
                    </div>
                    <div class="config-input-group">
                        <span>容量:</span>
                        <input type="number"
                               id="redisClusterInput"
                               min="1"
                               step="1"
                               placeholder="GB"
                               value="${capacity}">
                        <span>GB</span>
                    </div>
                </div>

                <div style="font-size: 0.8125rem; color: var(--text-tertiary); margin-top: var(--space-2);">
                    💡 节点数必须是3的倍数（3, 6, 9, 12...）
                </div>

                <div class="config-actions">
                    <button class="add-btn" onclick="addRedisConfig('cluster')">
                        ✓ 添加Redis集群服务
                    </button>
                </div>
            </div>
        `;
    }
}

// 更新Redis集群节点数
function updateRedisClusterNodes(value) {
    const numValue = parseInt(value);
    if (isNaN(numValue) || numValue < 3 || numValue % 3 !== 0) {
        showNotification('节点数必须是3的倍数', 'error');
        return;
    }
    state.redisConfig.clusterNodes = numValue;
    renderServicesList();
    showNotification(`已更新为 ${numValue} 节点`, 'success');
}

// 添加Redis配置
function addRedisConfig(type) {
    if (type === 'master') {
        const input = document.getElementById('redisMasterInput');
        const capacity = parseInt(input.value);

        if (isNaN(capacity) || capacity <= 0) {
            showNotification('请输入有效的容量', 'error');
            input.focus();
            return;
        }

        const service = servicesData['缓存服务'].find(s => s.type === 'redis_master');
        const unitPrice = service.price * 2;  // 2节点 × 单价(GB/月)

        // 检查是否已存在
        const existingIndex = state.selectedServices.findIndex(s => s.code === 'redis_master');

        const redisItem = {
            name: service.name,
            code: 'redis_master',
            category: '缓存服务',
            configName: '2节点主备',
            quantity: capacity,
            unit: 'GB',
            price: unitPrice,  // 存储的是2节点后的单价
            discount: service.discount,
            type: 'redis_master',
            billingType: 'monthly',
            nodeCount: 2,
            capacity: capacity
        };

        if (existingIndex >= 0) {
            state.selectedServices[existingIndex].quantity = capacity;
            showNotification('已更新Redis主备配置', 'info');
        } else {
            state.selectedServices.push(redisItem);
            showNotification('已添加Redis主备服务', 'success');
        }

        renderServicesList();
        updateResult();
    } else {
        const nodesInput = document.getElementById('redisClusterNodes');
        const capacityInput = document.getElementById('redisClusterInput');
        const nodeCount = parseInt(nodesInput.value);
        const capacity = parseInt(capacityInput.value);

        // 验证节点数
        if (isNaN(nodeCount) || nodeCount < 3 || nodeCount % 3 !== 0) {
            showNotification('节点数必须是3的倍数', 'error');
            nodesInput.focus();
            return;
        }

        // 验证容量
        if (isNaN(capacity) || capacity <= 0) {
            showNotification('请输入有效的容量', 'error');
            capacityInput.focus();
            return;
        }

        const service = servicesData['缓存服务'].find(s => s.type === 'redis_cluster');
        const unitPrice = service.price * nodeCount;  // 节点数 × 单价(GB/月)

        // 检查是否已存在（相同节点数）
        const existingIndex = state.selectedServices.findIndex(s =>
            s.code === 'redis_cluster' && s.nodeCount === nodeCount
        );

        const redisItem = {
            name: service.name,
            code: 'redis_cluster',
            category: '缓存服务',
            configName: `${nodeCount}节点集群`,
            quantity: capacity,
            unit: 'GB',
            price: unitPrice,
            discount: service.discount,
            type: 'redis_cluster',
            billingType: 'monthly',
            nodeCount: nodeCount,
            capacity: capacity
        };

        if (existingIndex >= 0) {
            state.selectedServices[existingIndex].quantity = capacity;
            showNotification('已更新Redis集群配置', 'info');
        } else {
            state.selectedServices.push(redisItem);
            showNotification('已添加Redis集群服务', 'success');
        }

        renderServicesList();
        updateResult();
    }
}

// 添加推荐服务（快捷方式）
function addRecommendService(code) {
    // 检查是否是云主机
    if (code === 'server') {
        // 切换到推荐服务标签
        state.currentCategory = '推荐服务';
        renderCategoryTabs();
        renderServicesList();
        return;
    }

    // 检查是否是带宽
    if (code === 'bandwidth') {
        // 切换到推荐服务标签并聚焦到带宽输入
        state.currentCategory = '推荐服务';
        renderCategoryTabs();
        renderServicesList();
        setTimeout(() => {
            const input = document.getElementById('bandwidthInput');
            if (input) input.focus();
        }, 100);
        return;
    }

    // 检查是否是Redis缓存
    if (code === 'redis_master' || code === 'redis_cluster') {
        // 切换到缓存服务标签
        state.currentCategory = '缓存服务';
        renderCategoryTabs();
        renderServicesList();
        return;
    }

    // 检查是否已添加
    const isAdded = state.selectedServices.some(s => s.code === code);
    if (isAdded) {
        showNotification('该服务已添加', 'info');
        return;
    }

    // 查找服务定义
    let service = null;
    for (const category in servicesData) {
        const found = servicesData[category].find(s => s.code === code);
        if (found) {
            service = found;
            break;
        }
    }

    if (service) {
        state.selectedServices.push({
            ...service,
            quantity: 1,
            category: getServiceCategory(code)
        });
        showNotification(`已添加 ${service.name}`, 'success');
        renderRecommendBar();
        renderServicesList();
        updateResult();

        // 添加添加成功的视觉反馈 - 在推荐栏中为刚添加的项目添加闪烁效果
        setTimeout(() => {
            const recommendItems = document.querySelectorAll('.recommend-item');
            recommendItems.forEach(item => {
                if (item.textContent.includes(service.name)) {
                    item.style.animation = 'pulse-btn 0.6s ease-in-out';
                    setTimeout(() => {
                        item.style.animation = '';
                    }, 600);
                }
            });
        }, 100);
    }
}

// 获取服务所在分类
function getServiceCategory(code) {
    for (const category in servicesData) {
        if (servicesData[category].some(s => s.code === code)) {
            return category;
        }
    }
    return '其他';
}

// 获取Redis服务的容量（用于配置器显示）
function getServiceRedisCapacity(code) {
    const service = state.selectedServices.find(s => s.code === code);
    return service ? service.capacity : '';
}

// 添加存储盘
function addStorageDisk() {
    const typeSelect = document.getElementById('newDiskType');
    const sizeInput = document.getElementById('newDiskSize');

    if (!typeSelect || !sizeInput) {
        showToast('无法找到存储输入框');
        return;
    }

    const type = typeSelect.value;
    const size = parseInt(sizeInput.value);

    if (!size || size <= 0) {
        showNotification('请输入有效的存储容量', 'error');
        sizeInput.focus();
        return;
    }

    // 添加到存储盘列表
    state.serverConfig.storageDisks.push({ type, size });

    // 清空输入框
    sizeInput.value = '';

    renderServicesList();
    showNotification(`已添加 ${type} ${size}GB`, 'success');
}

// 移除存储盘
function removeStorageDisk(index) {
    state.serverConfig.storageDisks.splice(index, 1);
    renderServicesList();
    showToast('已移除存储盘');
}

// 选择预设配置
function selectPreset(name, cpu, memory) {
    state.serverConfig = {
        ...state.serverConfig,
        cpu: cpu,
        memory: memory,
        preset: name
    };
    renderServicesList();
}

// 更新自定义配置
function updateCustomConfig(field, value) {
    const numValue = parseFloat(value) || 0;

    if (field === 'quantity') {
        state.serverConfig[field] = numValue > 0 ? numValue : 1;
    } else {
        state.serverConfig[field] = numValue;

        // 如果输入了自定义值，清除预设选择
        if ((field === 'cpu' || field === 'memory') && numValue > 0) {
            const presets = servicesData['推荐服务'].find(s => s.type === 'server').presets;
            const matchedPreset = presets.find(p =>
                p.cpu === state.serverConfig.cpu && p.memory === state.serverConfig.memory
            );
            state.serverConfig.preset = matchedPreset ? matchedPreset.name : null;
        }
    }

    renderServicesList();
}

// 添加服务器配置
function addServerConfig() {
    const { cpu, memory, quantity, storageDisks } = state.serverConfig;

    if (cpu <= 0 || memory <= 0 || quantity <= 0) {
        showNotification('请输入有效的CPU、内存和数量', 'error');
        return;
    }

    const configName = state.serverConfig.preset || `${cpu}核${memory}G`;

    // 生成存储磁盘摘要
    let storageSummary = '';
    let storageName = '';
    if (storageDisks.length > 0) {
        const sasDisks = storageDisks.filter(d => d.type === 'SAS');
        const ssdDisks = storageDisks.filter(d => d.type === 'SSD');
        const parts = [];

        if (sasDisks.length > 0) {
            const totalSas = sasDisks.reduce((sum, d) => sum + d.size, 0);
            parts.push(`${totalSas}GB SAS`);
        }
        if (ssdDisks.length > 0) {
            const totalSsd = ssdDisks.reduce((sum, d) => sum + d.size, 0);
            parts.push(`${totalSsd}GB SSD`);
        }

        storageSummary = parts.join(' + ');
        storageName = ` + ${storageSummary}`;
    }

    const service = servicesData['推荐服务'].find(s => s.type === 'server');

    // 计算基础价格
    const baseCpuPrice = cpu * service.cpuPrice;
    const baseMemoryPrice = memory * service.memoryPrice;
    let baseStoragePrice = 0;

    storageDisks.forEach(disk => {
        baseStoragePrice += disk.size * storageConfig[disk.type].price;
    });

    const totalPrice = baseCpuPrice + baseMemoryPrice + baseStoragePrice;

    // 检查是否已存在
    const existingIndex = state.selectedServices.findIndex(s => {
        if (s.code !== 'server') return false;
        if (s.cpu !== cpu || s.memory !== memory || s.quantity !== quantity) return false;

        // 比较存储盘配置
        if (s.storageDisks.length !== storageDisks.length) return false;

        // 检查是否相同（忽略顺序）
        const sSorted = [...s.storageDisks].sort((a, b) => a.type.localeCompare(b.type) || a.size - b.size);
        const newSorted = [...storageDisks].sort((a, b) => a.type.localeCompare(b.type) || a.size - b.size);

        return sSorted.every((d, idx) =>
            d.type === newSorted[idx].type && d.size === newSorted[idx].size
        );
    });

    const serverItem = {
        name: '云主机',
        code: 'server',
        category: '计算服务',
        configName: configName + storageName,
        cpu: cpu,
        memory: memory,
        storageDisks: JSON.parse(JSON.stringify(storageDisks)), // 深拷贝
        storageSummary: storageSummary,
        quantity: quantity,
        unit: '台',
        price: totalPrice,
        discount: service.discount,
        type: 'server',
        billingType: 'monthly',
        recommend: true
    };

    if (existingIndex >= 0) {
        state.selectedServices[existingIndex].quantity = quantity;
        showNotification('已更新云主机配置', 'info');
    } else {
        state.selectedServices.push(serverItem);
        showNotification('已添加云主机配置', 'success');
    }

    renderRecommendBar();
    updateResult();
}

// 更新带宽配置
function updateBandwidthConfig(value) {
    const numValue = parseInt(value) || 0;
    state.bandwidthConfig.size = numValue > 0 ? numValue : 0;
    renderServicesList();
}

// 添加带宽配置
function addBandwidthConfig() {
    const { size } = state.bandwidthConfig;

    if (size <= 0) {
        showNotification('请输入有效的带宽值', 'error');
        return;
    }

    // 自动计算带宽价格
    let priceUnit = 0;
    let tierName = '';
    if (size < 5) {
        priceUnit = 13.6;
        tierName = '＜5M';
    } else if (size < 10) {
        priceUnit = 17;
        tierName = '5M-10M';
    } else {
        priceUnit = 25.5;
        tierName = '≥10M';
    }

    const totalPrice = size * priceUnit;
    const configName = `${size}M (${tierName})`;

    // 检查是否已存在
    const existingIndex = state.selectedServices.findIndex(s => s.code === 'bandwidth');

    const bandwidthItem = {
        name: '互联网带宽',
        code: 'bandwidth',
        category: '网络服务',
        configName: configName,
        quantity: 1,
        unit: 'M',
        price: totalPrice,
        discount: false,
        type: 'bandwidth',
        billingType: 'monthly',
        recommend: true,
        // 存储原始值用于计算
        rawSize: size,
        rawPriceUnit: priceUnit
    };

    if (existingIndex >= 0) {
        state.selectedServices[existingIndex] = bandwidthItem;
        showNotification('已更新带宽配置', 'info');
    } else {
        state.selectedServices.push(bandwidthItem);
        showNotification('已添加带宽配置', 'success');
    }

    renderServicesList();
    updateResult();
}

// 获取当前数量
function getQuantity(code) {
    const service = state.selectedServices.find(s => s.code === code);
    return service ? service.quantity : '';
}

// 切换分类
function switchCategory(category) {
    state.currentCategory = category;
    renderCategoryTabs();
    renderServicesList();
}

// 切换服务（添加/移除）
function toggleService(code) {
    // 渲染器服务使用配置器，不支持普通toggle
    if (code === 'redis_master' || code === 'redis_cluster') {
        showNotification('请使用配置器添加服务', 'info');
        return;
    }

    // 查找服务定义
    let service = null;
    for (const category in servicesData) {
        const found = servicesData[category].find(s => s.code === code);
        if (found) {
            service = found;
            break;
        }
    }

    if (!service) return;

    const input = document.getElementById(`input-${code}`);
    const quantity = parseFloat(input.value);

    if (isNaN(quantity) || quantity <= 0) {
        showNotification('请输入有效的数量', 'error');
        input.focus();
        return;
    }

    // 检查是否已存在
    const existingIndex = state.selectedServices.findIndex(s => s.code === code);

    if (existingIndex >= 0) {
        state.selectedServices[existingIndex].quantity = quantity;
        showNotification('已更新数量', 'info');
    } else {
        state.selectedServices.push({
            ...service,
            quantity: quantity,
            category: getServiceCategory(code)
        });
        showNotification('已添加服务', 'success');
    }

    renderRecommendBar();
    renderServicesList();
    updateResult();
}

// 更新结果 - 修复计费模式问题
function updateResult() {
    const month = state.month;
    const discountRate = state.discountRate;
    const discount = discountRate > 0;  // 折扣率大于0表示启用折扣

    // 更新计费周期
    let periodText = `计费周期：${month}个月`;

    // 检查是否存在按年计费的服务
    const hasYearlyService = state.selectedServices.some(s => s.billingType === 'yearly');
    if (hasYearlyService) {
        periodText += ' (含按年计费服务)';
    }
    document.getElementById('resultPeriod').textContent = periodText;

    // 更新选中服务列表
    const selectedContainer = document.getElementById('selectedServices');
    if (state.selectedServices.length === 0) {
        selectedContainer.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📦</div>
                <div class="empty-state-text">请在左侧选择服务并添加</div>
            </div>
        `;
    } else {
        selectedContainer.innerHTML = state.selectedServices.map((service, index) => {
            let basePrice, discountedPrice, finalPrice;

            // 处理不同的计费模式
            if (service.billingType === 'yearly') {
                // 按年计费服务：单价已经是一年的价格，需要乘以年数
                const years = Math.ceil(month / 12);
                basePrice = preciseMultiply(service.price, service.quantity * years);
            } else {
                // 按月计费服务：单价是月价格，需要乘以月数
                basePrice = preciseMultiply(service.price, service.quantity * month);
            }

            // 只有开启折扣且服务支持折扣时才计算折扣
            const discountMultiplier = discount && service.discount ? (discountRate / 100) : 1;
            discountedPrice = preciseMultiply(basePrice, discountMultiplier);
            finalPrice = discountedPrice;

            const icon = service.type === 'server' ? '💻 ' : (service.type === 'bandwidth' ? '🌐 ' : (service.recommend ? '⚡ ' : ''));

            // 生成存储盘详情显示
            let storageDetail = '';
            if (service.type === 'server' && service.storageDisks && service.storageDisks.length > 0) {
                const sasDisks = service.storageDisks.filter(d => d.type === 'SAS');
                const ssdDisks = service.storageDisks.filter(d => d.type === 'SSD');
                const parts = [];
                if (sasDisks.length > 0) {
                    const totalSas = sasDisks.reduce((sum, d) => sum + d.size, 0);
                    parts.push(`${totalSas}GB SAS`);
                }
                if (ssdDisks.length > 0) {
                    const totalSsd = ssdDisks.reduce((sum, d) => sum + d.size, 0);
                    parts.push(`${totalSsd}GB SSD`);
                }
                if (parts.length > 0) {
                    storageDetail = ` + ${parts.join(' + ')}`;
                }
            }

            // 生成数量显示
            let quantityDisplay = '';
            if (service.type === 'server') {
                quantityDisplay = `${service.cpu}核${service.memory}G${storageDetail} × ${service.quantity}台 × ${month}个月`;
            } else if (service.type === 'bandwidth') {
                quantityDisplay = `${service.rawSize}M带宽 × ${month}个月`;
            } else if (service.type === 'redis_master') {
                quantityDisplay = `${service.capacity}GB (主备${service.nodeCount}节点) × ${month}个月`;
            } else if (service.type === 'redis_cluster') {
                quantityDisplay = `${service.capacity}GB (集群${service.nodeCount}节点) × ${month}个月`;
            } else if (service.billingType === 'yearly') {
                // 按年计费：显示年价，但按月数折算
                const years = Math.ceil(month / 12);
                quantityDisplay = `${service.quantity}${service.unit} × ${years}年`;
            } else {
                quantityDisplay = `${service.quantity}${service.unit} × ${month}个月`;
            }

            return `
                <div class="selected-item ${service.type === 'server' ? 'server' : ''} ${service.recommend ? 'recommend' : ''} ${!service.discount ? 'no-discount' : ''}">
                    <div class="selected-item-header">
                        <div class="selected-item-name">
                            ${icon}${service.name}
                            ${service.configName ? ` - ${service.configName}` : ''}
                            ${service.billingType === 'yearly' ? '<span style="font-size:0.75rem; background:var(--warning-500); color:white; padding:1px 4px; border-radius:3px; margin-left:4px;">按年</span>' : ''}
                        </div>
                        <button class="remove-btn" onclick="removeService(${index})">×</button>
                    </div>
                    <div class="selected-item-details">
                        ${quantityDisplay}
                        ${service.discount ? '' : ' (不参与折扣)'}
                    </div>
                    <div class="selected-item-price ${discount && service.discount && discountRate < 100 ? 'discounted' : ''}">
                        ${discount && service.discount && discountRate < 100 && basePrice !== finalPrice ?
                            `<span class="original">¥${basePrice.toFixed(2)}</span>` : ''}
                        ¥${finalPrice.toFixed(2)}
                    </div>
                </div>
            `;
        }).join('');
    }

    // 计算总计 - 修复计费逻辑
    let originalTotal = 0;
    let discountTotal = 0;

    state.selectedServices.forEach(service => {
        let basePrice;

        // 根据计费模式计算基础价格
        if (service.billingType === 'yearly') {
            // 按年计费：单价 × 数量 × 年数（以月数折算）
            const years = Math.ceil(month / 12);
            basePrice = preciseMultiply(service.price, service.quantity * years);
        } else {
            // 按月计费：单价 × 数量 × 月数
            basePrice = preciseMultiply(service.price, service.quantity * month);
        }

        // 只有开启折扣且服务支持折扣时才计算折扣
        const discountMultiplier = discount && service.discount ? (discountRate / 100) : 1;
        const discountedPrice = preciseMultiply(basePrice, discountMultiplier);

        originalTotal = preciseAdd(originalTotal, basePrice);
        discountTotal = preciseAdd(discountTotal, discountedPrice);
    });

    const finalPrice = discount ? discountTotal : originalTotal;
    const savings = discount ? preciseAdd(originalTotal, -discountTotal) : 0;

    // 更新显示 - 使用数字动画
    const serviceCountEl = document.getElementById('serviceCount');
    const originalTotalEl = document.getElementById('originalTotal');
    const discountTotalEl = document.getElementById('discountTotal');
    const finalTotalEl = document.getElementById('finalTotal');

    if (serviceCountEl) serviceCountEl.textContent = state.selectedServices.length;

    // 为价格元素添加动画（确保元素存在）
    if (originalTotalEl && discountTotalEl && finalTotalEl) {
        // 存储目标值用于动画
        originalTotalEl.dataset.targetValue = originalTotal;
        discountTotalEl.dataset.targetValue = discountTotal;
        finalTotalEl.dataset.targetValue = finalPrice;

        // 执行动画
        if (window.numberAnimator) {
            numberAnimator.animate(originalTotalEl, originalTotal, 800);
            numberAnimator.animate(discountTotalEl, discountTotal, 800);
            numberAnimator.animate(finalTotalEl, finalPrice, 800);
        } else {
            // 如果动画系统还未加载，使用静态更新
            originalTotalEl.textContent = `¥${originalTotal.toFixed(2)}`;
            discountTotalEl.textContent = `¥${discountTotal.toFixed(2)}`;
            finalTotalEl.textContent = `¥${finalPrice.toFixed(2)}`;
        }
    }

    // 显示/隐藏折扣行和节省金额
    const discountRow = document.getElementById('discountRow');
    const savingsDiv = document.getElementById('savings');

    if (discountRow && savingsDiv) {
        if (discount && originalTotal > 0) {
            discountRow.style.display = 'flex';
            savingsDiv.style.display = 'block';

            // 动画更新节省金额显示
            const savingsText = `💡 节省 ¥${savings.toFixed(2)} (${((1 - discountTotal / originalTotal) * 100).toFixed(1)}%)`;
            if (savingsDiv.textContent !== savingsText) {
                savingsDiv.textContent = savingsText;
                // 添加闪烁动画效果
                savingsDiv.style.animation = 'none';
                setTimeout(() => {
                    savingsDiv.style.animation = 'pulse 1.5s infinite';
                }, 10);
            }
        } else {
            discountRow.style.display = 'none';
            savingsDiv.style.display = 'none';
        }
    }
}

// 移除服务 - 带有弹出动画效果
function removeService(index) {
    // 获取要移除的元素，添加弹出动画
    const selectedContainer = document.getElementById('selectedServices');
    const items = selectedContainer.querySelectorAll('.selected-item');

    if (items[index]) {
        const item = items[index];
        item.style.transition = 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)';
        item.style.transform = 'translateX(100px) scale(0.9)';
        item.style.opacity = '0';

        // 等待动画完成后执行移除
        setTimeout(() => {
            state.selectedServices.splice(index, 1);
            renderRecommendBar();
            renderServicesList();
            updateResult();
            showToast('已移除服务');

            // 如果有剩余项，添加滑入动画
            setTimeout(() => {
                const newItems = selectedContainer.querySelectorAll('.selected-item');
                newItems.forEach((newItem, i) => {
                    if (i >= index) {
                        newItem.style.animation = 'slideInRight 0.3s ease-out';
                    }
                });
            }, 50);
        }, 300);
    } else {
        // 如果找不到元素，直接执行原逻辑
        state.selectedServices.splice(index, 1);
        renderRecommendBar();
        renderServicesList();
        updateResult();
        showToast('已移除服务');
    }
}

// 精确计算
function preciseMultiply(a, b) {
    const factor = 10000;
    return Math.round(a * b * factor) / factor;
}

function preciseAdd(a, b) {
    const factor = 10000;
    return Math.round((a + b) * factor) / factor;
}

// 复制结果
function copyResult() {
    if (state.selectedServices.length === 0) {
        showNotification('请先选择服务', 'error');
        return;
    }

    const month = state.month;
    const discount = state.discount;
    const hasYearlyService = state.selectedServices.some(s => s.billingType === 'yearly');

    let text = '☁️ 开投智云价格计算器结果\n';
    text += '='.repeat(50) + '\n\n';
    text += `计费周期：${month}个月`;
    if (hasYearlyService) {
        text += ' (含按年计费服务)';
    }
    text += '\n';
    text += `折扣状态：${discount ? '85折已应用' : '原价'}\n\n`;

    let originalTotal = 0;
    let discountTotal = 0;

    state.selectedServices.forEach(service => {
        // 根据计费模式计算基础价格
        let basePrice;
        if (service.billingType === 'yearly') {
            // 按年计费：单价 × 数量 × 年数（以月数折算）
            const years = Math.ceil(month / 12);
            basePrice = preciseMultiply(service.price, service.quantity * years);
        } else {
            basePrice = preciseMultiply(service.price, service.quantity * month);
        }

        const discountedPrice = service.discount ? preciseMultiply(basePrice, 0.85) : basePrice;
        const finalPrice = discount ? discountedPrice : basePrice;

        originalTotal = preciseAdd(originalTotal, basePrice);
        discountTotal = preciseAdd(discountTotal, discountedPrice);

        text += `【${service.category}】${service.name}`;
        if (service.configName) {
            text += ` (${service.configName})`;
        }
        text += `\n`;

        if (service.billingType === 'yearly') {
            const years = Math.ceil(month / 12);
            text += `  计费方式：按年计费\n`;
            text += `  配置：${service.quantity}${service.unit} × ${years}年\n`;
            text += `  年价：¥${service.price.toFixed(2)}/年\n`;
        } else if (service.type === 'server') {
            text += `  配置：${service.cpu}核${service.memory}G${service.storageSummary ? ` + ${service.storageSummary}` : ''} × ${service.quantity}台 × ${month}个月\n`;
            text += `  单价：¥${service.price.toFixed(2)}/月\n`;
        } else if (service.type === 'bandwidth') {
            text += `  配置：${service.rawSize}M带宽 × ${month}个月\n`;
            text += `  单价：¥${service.price.toFixed(2)}/月\n`;
        } else if (service.type === 'redis_master') {
            text += `  配置：${service.capacity}GB (主备${service.nodeCount}节点) × ${month}个月\n`;
            text += `  单价：¥${service.price.toFixed(2)}/GB/月\n`;
        } else if (service.type === 'redis_cluster') {
            text += `  配置：${service.capacity}GB (集群${service.nodeCount}节点) × ${month}个月\n`;
            text += `  单价：¥${service.price.toFixed(2)}/GB/月\n`;
        } else {
            text += `  数量：${service.quantity}${service.unit} × ${month}个月\n`;
            text += `  单价：¥${service.price.toFixed(2)}/月\n`;
        }

        text += `  小计：¥${finalPrice.toFixed(2)}`;
        if (discount && service.discount && basePrice !== finalPrice) {
            text += ` (原¥${basePrice.toFixed(2)})`;
        }
        if (!service.discount) {
            text += ` [不参与折扣]`;
        }
        text += `\n\n`;
    });

    text += '='.repeat(50) + '\n';
    text += `原价总计：¥${originalTotal.toFixed(2)}\n`;
    if (discount) {
        text += `折扣后总计：¥${discountTotal.toFixed(2)}\n`;
        text += `节省金额：¥${preciseAdd(originalTotal, -discountTotal).toFixed(2)}\n`;
    } else {
        text += `应付总计：¥${originalTotal.toFixed(2)}\n`;
    }
    text += '\n计算时间：' + new Date().toLocaleString('zh-CN');

    // 复制到剪贴板
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            showNotification('结果已复制到剪贴板', 'success');
        }).catch(() => {
            fallbackCopy(text);
        });
    } else {
        fallbackCopy(text);
    }
}

// 降级复制
function fallbackCopy(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();

    try {
        document.execCommand('copy');
        showNotification('结果已复制到剪贴板', 'success');
    } catch (err) {
        showNotification('复制失败，请手动复制', 'error');
    }

    document.body.removeChild(textarea);
}

// 重置所有
function resetAll() {
    // 检查是否为空（简化判断，不再检查 discount 字段）
    if (state.selectedServices.length === 0 && state.month === 1 && state.discountRate === 85 &&
        state.serverConfig.cpu === 0 && state.serverConfig.memory === 0 && state.bandwidthConfig.size === 0) {
        showToast('没有需要重置的内容');
        return;
    }

    if (confirm('确定要重置所有选择吗？')) {
        state.selectedServices = [];
        state.month = 1;
        state.discountRate = 85;
        state.serverConfig = { cpu: 0, memory: 0, quantity: 1, preset: null, storageDisks: [] };
        state.bandwidthConfig = { size: 0 };
        state.redisConfig = { masterNodes: 2, clusterNodes: 3 };
        state.currentCategory = '推荐服务';

        // 更新输入框
        const monthInput = document.getElementById('monthInput');
        const discountInput = document.getElementById('discountInput');
        if (monthInput) monthInput.value = 1;
        if (discountInput) discountInput.value = 85;

        // 重新渲染
        renderCategoryTabs();
        renderRecommendBar();
        renderServicesList();
        updateResult();

        showToast('已重置所有内容');
    }
}

// ========================================
// 增强动画和视觉效果系统
// ========================================

// 数字动画管理器 - 用于价格显示的平滑数字过渡
const numberAnimator = {
    // 缓动函数：easeOutCubic
    easeOutCubic: (t) => 1 - Math.pow(1 - t, 3),

    // 缓动函数：easeOutQuart
    easeOutQuart: (t) => 1 - Math.pow(1 - t, 4),

    // 缓动函数：easeOutExpo
    easeOutExpo: (t) => t === 1 ? 1 : 1 - Math.pow(2, -10 * t),

    // 格式化数字（添加千分位）
    formatNumber: (num) => {
        return num.toLocaleString('zh-CN', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    },

    // 动画函数
    animate: (element, targetValue, duration = 800, decimalPlaces = 2) => {
        if (!element) return;

        const startValue = parseFloat(element.dataset.currentValue) || 0;
        const startTime = performance.now();

        // 存储当前值
        element.dataset.targetValue = targetValue;

        const update = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // 使用缓动函数
            const easedProgress = numberAnimator.easeOutQuart(progress);

            // 计算当前值
            const currentValue = startValue + (targetValue - startValue) * easedProgress;

            // 更新显示
            element.textContent = '¥' + currentValue.toFixed(decimalPlaces);
            element.dataset.currentValue = currentValue;

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                // 动画完成，确保显示精确值
                element.textContent = '¥' + targetValue.toFixed(decimalPlaces);
                element.dataset.currentValue = targetValue;

                // 添加完成光效
                element.classList.add('animated-in');
                setTimeout(() => element.classList.remove('animated-in'), 600);
            }
        };

        requestAnimationFrame(update);
    },

    // 动画多个价格元素
    animateAll: (selector, duration = 600) => {
        document.querySelectorAll(selector).forEach(el => {
            const target = parseFloat(el.dataset.targetValue || el.textContent.replace(/[¥,]/g, ''));
            if (!isNaN(target) && target > 0) {
                numberAnimator.animate(el, target, duration);
            }
        });
    }
};

// 增强通知管理器 - 支持多通知、滑动动画、队列管理
const notificationManager = {
    notifications: [],
    container: null,
    maxVisible: 3,
    autoId: 0,

    // 初始化容器
    init: function() {
        if (!this.container) {
            this.container = document.createElement('div');
            this.container.id = 'notificationContainer';
            this.container.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 9999;
                display: flex;
                flex-direction: column;
                gap: 12px;
                max-width: 380px;
            `;
            document.body.appendChild(this.container);
        }
        return this;
    },

    // 显示通知
    show: function(message, type = 'info', duration = 3000) {
        if (!this.container) this.init();

        const id = ++this.autoId;
        const titles = {
            success: '✓ 成功',
            error: '✗ 错误',
            info: 'ℹ 信息',
            warning: '⚠ 警告'
        };

        // 创建通知项
        const notification = {
            id,
            type,
            message,
            duration,
            title: titles[type] || 'ℹ 信息',
            element: null,
            timeout: null
        };

        // 添加到队列
        this.notifications.push(notification);

        // 渲染
        this.render(notification);

        // 自动移除 - 在渲染完成后开始计时（已经等待动画完成0.4s）
        if (duration > 0) {
            notification.timeout = setTimeout(() => {
                this.remove(id);
            }, duration);
        }

        return id;
    },

    // 渲染单个通知
    render: function(notification) {
        const el = document.createElement('div');
        el.className = `notification-item ${notification.type}`;
        el.dataset.id = notification.id;

        // 应用增强样式
        const bgGradient = {
            success: 'linear-gradient(135deg, rgba(16, 185, 129, 0.95), rgba(5, 150, 105, 0.95))',
            error: 'linear-gradient(135deg, rgba(239, 68, 68, 0.95), rgba(220, 38, 38, 0.95))',
            info: 'linear-gradient(135deg, rgba(99, 102, 241, 0.95), rgba(79, 70, 229, 0.95))',
            warning: 'linear-gradient(135deg, rgba(245, 158, 11, 0.95), rgba(217, 119, 6, 0.95))'
        };

        el.style.cssText = `
            background: ${bgGradient[notification.type]};
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            color: white;
            padding: 16px 20px;
            border-radius: 12px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
            border: 1px solid rgba(255, 255, 255, 0.2);
            display: flex;
            align-items: flex-start;
            gap: 14px;
            min-width: 280px;
            max-width: 380px;
            pointer-events: all;
            cursor: pointer;
            transform: translateX(0) translateY(20px) scale(0.9);
            opacity: 0;
            animation: slidePop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
            position: relative;
            overflow: hidden;
        `;

        // 添加图标
        const icons = {
            success: '✓',
            error: '✗',
            info: 'ℹ',
            warning: '⚠'
        };

        el.innerHTML = `
            <div style="font-size: 24px; line-height: 1; flex-shrink: 0; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));">
                ${icons[notification.type]}
            </div>
            <div style="flex: 1; padding: 2px 0;">
                <div style="font-weight: 800; margin-bottom: 4px; font-size: 15px; letter-spacing: 0.3px;">
                    ${notification.title}
                </div>
                <div style="font-size: 13px; line-height: 1.5; opacity: 0.95; font-weight: 500;">
                    ${notification.message}
                </div>
            </div>
            <div style="font-size: 12px; opacity: 0.7; flex-shrink: 0;">✕</div>
        `;

        // 点击关闭
        el.addEventListener('click', () => {
            this.remove(notification.id);
        });

        // 手势支持 - 滑动关闭
        let startX = 0;
        el.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        });

        el.addEventListener('touchmove', (e) => {
            const currentX = e.touches[0].clientX;
            const diff = currentX - startX;
            if (diff > 0) {
                el.style.transform = `translateX(${diff}px) scale(1)`;
            }
        });

        el.addEventListener('touchend', (e) => {
            const endX = e.changedTouches[0].clientX;
            if (endX - startX > 100) {
                this.remove(notification.id);
            } else {
                el.style.transform = '';
            }
        });

        notification.element = el;
        this.container.appendChild(el);

        // 添加进入动画后的浮动效果
        setTimeout(() => {
            if (el && el.style) {
                el.style.animation = '';
                el.style.transition = 'transform 0.2s ease, box-shadow 0.2s ease';
            }
        }, 400);
    },

    // 移除通知 - 带平滑动画
    remove: function(id) {
        const index = this.notifications.findIndex(n => n.id === id);
        if (index === -1) return;

        const notification = this.notifications[index];

        // 清除超时
        if (notification.timeout) {
            clearTimeout(notification.timeout);
            notification.timeout = null;
        }

        // 移除动画
        if (notification.element) {
            notification.element.style.animation = 'fadeOut 0.3s ease forwards';
            notification.element.style.transform = 'translateX(100px) scale(0.9)';

            setTimeout(() => {
                if (notification.element && notification.element.parentNode) {
                    notification.element.parentNode.removeChild(notification.element);
                }
            }, 300);
        }

        this.notifications.splice(index, 1);
    },

    // 清除所有通知
    clearAll: function() {
        this.notifications.forEach(n => {
            if (n.timeout) {
                clearTimeout(n.timeout);
                n.timeout = null;
            }
            if (n.element && n.element.parentNode) {
                n.element.parentNode.removeChild(n.element);
            }
        });
        this.notifications = [];
    }
};

// 旧版提示框（向后兼容）
function showToast(message) {
    // 使用新的通知系统，颜色稍浅
    if (!window.notificationManager) {
        notificationManager.init();
    }
    notificationManager.show(message, 'info', 6000);
}

// 增强通知显示（使用新系统）
function showNotification(message, type = 'info') {
    if (!window.notificationManager) {
        notificationManager.init();
    }
    notificationManager.show(message, type, 7000);
}

// 按钮点击涟漪效果
function createRipple(event, element = null) {
    const target = element || event.currentTarget;
    if (!target) return;

    // 如果已存在涟漪，移除它
    const existingRipple = target.querySelector('.ripple-effect');
    if (existingRipple) {
        existingRipple.remove();
    }

    const rect = target.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX ? (event.clientX - rect.left - size / 2) : (rect.width / 2 - size / 2);
    const y = event.clientY ? (event.clientY - rect.top - size / 2) : (rect.height / 2 - size / 2);

    const ripple = document.createElement('span');
    ripple.className = 'ripple-effect';
    ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: rgba(255, 255, 255, 0.5);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple 0.6s ease-out;
        pointer-events: none;
        z-index: 1;
    `;

    // 只在需要时设置 position，避免影响已定位的元素
    const currentPos = window.getComputedStyle(target).position;
    if (currentPos === 'static') {
        target.style.position = 'relative';
    }
    target.style.overflow = 'hidden';
    target.appendChild(ripple);

    // 清理
    setTimeout(() => {
        if (ripple.parentNode) {
            ripple.remove();
        }
    }, 600);
}

// 数字动画辅助函数
function animateValue(element, start, end, duration = 600) {
    if (!element) return;
    numberAnimator.animate(element, end, duration);
}

// 页面加载完成时的欢迎动画
function showWelcomeAnimation() {
    // 延迟显示，确保UI已渲染
    setTimeout(() => {
        showNotification('开投智云计算器已就绪，开始配置吧！', 'success');
    }, 800);
}

// 为所有按钮添加涟漪效果绑定的辅助函数
function bindRippleEffectToButtons() {
    const buttons = document.querySelectorAll('.add-btn, .btn, .quick-btn, .config-preset, .recommend-item, .service-card');
    buttons.forEach(btn => {
        // 检查是否已绑定
        if (btn.dataset.rippleBound === 'true') return;

        btn.addEventListener('click', function(e) {
            // 对于功能性按钮，先执行原功能，再添加视觉效果
            if (this.classList.contains('add-btn') || this.classList.contains('btn')) {
                // 快速视觉反馈
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = '';
                }, 100);
            }
            createRipple(e, this);
        });

        btn.dataset.rippleBound = 'true';
    });
}

// 页面可见性变化时的处理 - 修复通知闪烁问题
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // 页面隐藏时清除所有通知
        if (window.notificationManager) {
            notificationManager.clearAll();
        }
    } else {
        // 页面重新可见时，不做任何操作，避免触发通知闪烁
        // 原本可能有某些代码在这里重新触发通知
    }
});

// 模态框相关
function showModal(title, body, footerHtml = '') {
    document.getElementById('modalTitle').textContent = title;
    document.getElementById('modalBody').innerHTML = body;
    if (footerHtml) {
        document.getElementById('modalFooter').innerHTML = footerHtml;
    }
    document.getElementById('modal').classList.add('show');
}

function closeModal() {
    document.getElementById('modal').classList.remove('show');
}

// 显示安全服务一键配置模态框
function showSecurityConfigModal() {
    // 获取所有云主机配置的总数量（包括多条云主机配置）
    let totalCloudHostCount = 0;

    // 从selectedServices中统计所有云主机数量
    const serverItems = state.selectedServices.filter(s => s.code === 'server');
    if (serverItems.length > 0) {
        totalCloudHostCount = serverItems.reduce((sum, s) => sum + (s.quantity || 0), 0);
    } else {
        // 如果selectedServices中没有，检查serverConfig用于预览
        const serverConfig = state.serverConfig;
        if (serverConfig.cpu > 0 && serverConfig.memory > 0) {
            totalCloudHostCount = serverConfig.quantity;
        }
    }

    const html = `
        <div class="security-config-form">
            <div style="margin-bottom: var(--space-4);">
                <div style="font-weight: 700; color: var(--text-primary); margin-bottom: var(--space-2);">
                    当前云主机配置
                </div>
                ${totalCloudHostCount > 0 ? `
                    <div style="padding: var(--space-3); background: var(--primary-50); border-radius: var(--radius-md); font-size: 0.9375rem;">
                        <div>🔢 云主机总数: ${totalCloudHostCount} 台</div>
                        ${serverItems.length > 1 ? `<div style="font-size: 0.875rem; color: var(--text-secondary);">包含 ${serverItems.length} 种配置规格</div>` : ''}
                    </div>
                ` : `
                    <div style="padding: var(--space-3); background: var(--warning-50); border-radius: var(--radius-md); color: var(--warning-700);">
                        ⚠️ 请先添加云主机配置到右侧列表
                    </div>
                `}
            </div>

            <div style="font-weight: 700; color: var(--text-primary); margin-bottom: var(--space-3);">
                安全服务配置清单
            </div>

            <div style="padding: var(--space-3); background: var(--bg-main); border-radius: var(--radius-md); border: 1px solid var(--border-light);">
                <div style="margin-bottom: var(--space-3);">
                    <strong>🛡️ 主机安全服务</strong>
                    <div style="font-size: 0.875rem; color: var(--text-secondary); margin-top: 4px;">
                        按云主机数量计算：${totalCloudHostCount > 0 ? totalCloudHostCount + ' 套' : '待配置云主机'}
                    </div>
                </div>

                <div style="margin-bottom: var(--space-3);">
                    <strong>📋 日志审计服务</strong>
                    <div style="font-size: 0.875rem; color: var(--text-secondary); margin-top: 4px;">
                        按云主机数量计算：${totalCloudHostCount > 0 ? totalCloudHostCount + ' 套' : '待配置云主机'}
                    </div>
                </div>

                <div style="margin-bottom: var(--space-3);">
                    <strong>🔥 云防火墙</strong>
                    <div style="font-size: 0.875rem; color: var(--text-secondary); margin-top: 4px;">
                        固定数量：2 套（Web应用防火墙 + 云防火墙）
                    </div>
                </div>

                <div>
                    <strong>🏰 云堡垒机</strong>
                    <div style="font-size: 0.875rem; color: var(--text-secondary); margin-top: 4px;">
                        ${totalCloudHostCount > 0 ?
                            (totalCloudHostCount > 10 ? '云主机数超过10台：2 套' : '云主机数≤10台：1 套')
                            : '待配置云主机'}
                    </div>
                </div>
            </div>

            ${totalCloudHostCount === 0 ? `
                <div style="margin-top: var(--space-3); font-size: 0.875rem; color: var(--text-tertiary);">
                    💡 请先在左侧配置云主机并点击"添加云主机配置"，然后再次点击此按钮
                </div>
            ` : ''}
        </div>
    `;

    const footerHtml = totalCloudHostCount > 0
        ? `<button class="btn btn-primary" onclick="configureSecurityServices()">✓ 确认添加</button><button class="btn btn-secondary" onclick="closeModal()">取消</button>`
        : `<button class="btn btn-secondary" onclick="closeModal()">关闭</button>`;

    showModal('🛡️ 一键配置安全服务', html, footerHtml);
}

// 配置安全服务
function configureSecurityServices() {
    // 获取所有云主机配置的总数量
    const serverItems = state.selectedServices.filter(s => s.code === 'server');
    if (serverItems.length === 0) {
        showNotification('请先添加云主机配置到列表', 'error');
        return;
    }

    const totalCloudHostCount = serverItems.reduce((sum, s) => sum + (s.quantity || 0), 0);

    if (totalCloudHostCount <= 0) {
        showNotification('云主机数量无效', 'error');
        return;
    }

    // 1. 主机安全服务 - 按云主机数量
    const hostSecurityService = servicesData['推荐服务'].find(s => s.code === 'host_security');
    if (hostSecurityService) {
        const existingIndex = state.selectedServices.findIndex(s => s.code === 'host_security');
        const item = {
            name: hostSecurityService.name,
            code: 'host_security',
            category: '安全服务',
            quantity: totalCloudHostCount,
            unit: '套',
            price: hostSecurityService.price,
            discount: hostSecurityService.discount,
            billingType: hostSecurityService.billingType
        };

        if (existingIndex >= 0) {
            state.selectedServices[existingIndex] = item;
        } else {
            state.selectedServices.push(item);
        }
    }

    // 2. 日志审计服务 - 按云主机数量
    const logAuditService = servicesData['推荐服务'].find(s => s.code === 'log_audit');
    if (logAuditService) {
        const existingIndex = state.selectedServices.findIndex(s => s.code === 'log_audit');
        const item = {
            name: logAuditService.name,
            code: 'log_audit',
            category: '安全服务',
            quantity: totalCloudHostCount,
            unit: '套',
            price: logAuditService.price,
            discount: logAuditService.discount,
            billingType: logAuditService.billingType
        };

        if (existingIndex >= 0) {
            state.selectedServices[existingIndex] = item;
        } else {
            state.selectedServices.push(item);
        }
    }

    // 3. 防火墙两个（Web应用防火墙 + 云防火墙）- 固定2套
    // Web应用防火墙
    const wafService = servicesData['推荐服务'].find(s => s.code === 'waf');
    if (wafService) {
        const existingIndex = state.selectedServices.findIndex(s => s.code === 'waf');
        const item = {
            name: wafService.name,
            code: 'waf',
            category: '安全服务',
            quantity: 1,
            unit: '套',
            price: wafService.price,
            discount: wafService.discount,
            billingType: wafService.billingType
        };

        if (existingIndex >= 0) {
            state.selectedServices[existingIndex] = item;
        } else {
            state.selectedServices.push(item);
        }
    }

    // 云防火墙
    const cloudFirewallService = servicesData['推荐服务'].find(s => s.code === 'cloud_firewall');
    if (cloudFirewallService) {
        const existingIndex = state.selectedServices.findIndex(s => s.code === 'cloud_firewall');
        const item = {
            name: cloudFirewallService.name,
            code: 'cloud_firewall',
            category: '安全服务',
            quantity: 1,
            unit: '套',
            price: cloudFirewallService.price,
            discount: cloudFirewallService.discount,
            billingType: cloudFirewallService.billingType
        };

        if (existingIndex >= 0) {
            state.selectedServices[existingIndex] = item;
        } else {
            state.selectedServices.push(item);
        }
    }

    // 4. 云堡垒机 - 超过10台云主机需要2套，否则1套
    const bastionService = servicesData['推荐服务'].find(s => s.code === 'bastion');
    if (bastionService) {
        const bastionCount = totalCloudHostCount > 10 ? 2 : 1;
        const existingIndex = state.selectedServices.findIndex(s => s.code === 'bastion');
        const item = {
            name: bastionService.name,
            code: 'bastion',
            category: '安全服务',
            quantity: bastionCount,
            unit: '套',
            price: bastionService.price,
            discount: bastionService.discount,
            billingType: bastionService.billingType
        };

        if (existingIndex >= 0) {
            state.selectedServices[existingIndex] = item;
        } else {
            state.selectedServices.push(item);
        }
    }

    // 更新界面
    renderRecommendBar();
    renderServicesList();
    updateResult();
    closeModal();

    showNotification('✓ 安全服务已配置完成', 'success');
}


// 保存配置
function saveConfig() {
    if (state.selectedServices.length === 0) {
        showNotification('没有内容需要保存', 'error');
        return;
    }

    const configName = prompt('请输入配置名称：', `配置_${new Date().toLocaleDateString()}`);
    if (!configName) return;

    // 获取当前所有配置
    const configs = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');

    // 创建新配置
    const newConfig = {
        name: configName,
        date: new Date().toLocaleString('zh-CN'),
        data: {
            discountRate: state.discountRate,
            month: state.month,
            selectedServices: state.selectedServices,
            serverConfig: state.serverConfig,
            bandwidthConfig: state.bandwidthConfig,
            redisConfig: state.redisConfig
        }
    };

    configs.push(newConfig);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(configs));

    showNotification(`配置 "${configName}" 已保存`, 'success');
}

// 加载配置
function loadConfig() {
    const configs = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');

    if (configs.length === 0) {
        showNotification('没有保存的配置', 'info');
        return;
    }

    let html = '<div class="saved-configs">';
    configs.forEach((config, index) => {
        html += `
            <div class="saved-config-item">
                <div>
                    <div class="saved-config-name">${config.name}</div>
                    <div class="saved-config-date">${config.date}</div>
                </div>
                <div class="saved-config-actions">
                    <button class="btn btn-small btn-primary" onclick="applyConfig(${index})">加载</button>
                    <button class="btn btn-small btn-secondary" onclick="deleteConfig(${index})">删除</button>
                </div>
            </div>
        `;
    });
    html += '</div>';

    showModal('加载配置', html, '<button class="btn btn-secondary" onclick="closeModal()">关闭</button>');
}

// 应用配置 - 带有过渡和动画效果
function applyConfig(index) {
    const configs = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    const config = configs[index];

    if (!config) return;

    // 添加配置加载过渡效果
    const mainContent = document.querySelector('.container');
    mainContent.style.transition = 'opacity 0.3s ease';
    mainContent.style.opacity = '0.3';

    setTimeout(() => {
        // 恢复状态 - 兼容旧配置（discount字段转换为discountRate）
        if (config.data.discountRate !== undefined) {
            state.discountRate = config.data.discountRate;
        } else if (config.data.discount !== undefined) {
            // 兼容旧配置：discount为true时使用85，false时使用0
            state.discountRate = config.data.discount ? 85 : 0;
        } else {
            state.discountRate = 85; // 默认值
        }
        state.month = config.data.month;
        state.selectedServices = config.data.selectedServices;
        state.serverConfig = config.data.serverConfig;
        state.bandwidthConfig = config.data.bandwidthConfig;
        // 恢复Redis配置（兼容旧配置）
        if (config.data.redisConfig) {
            state.redisConfig = config.data.redisConfig;
        }

        // 更新UI
        document.getElementById('monthInput').value = state.month;
        document.getElementById('discountInput').value = state.discountRate;

        renderRecommendBar();
        renderCategoryTabs();
        renderServicesList();
        updateResult();
        closeModal();

        // 恢复淡入效果
        mainContent.style.opacity = '1';

        // 添加成功动画通知
        const successMsg = `已加载配置 \"${config.name}\"`;
        showNotification(successMsg, 'success');

        // 为价格添加动画
        setTimeout(() => {
            const finalTotal = document.getElementById('finalTotal');
            if (finalTotal && finalTotal.dataset.currentValue) {
                finalTotal.style.animation = 'heartbeat 1s ease-in-out';
                setTimeout(() => finalTotal.style.animation = '', 1000);
            }
        }, 100);

    }, 300);
}

// 删除配置 - 带有删除动画
function deleteConfig(index) {
    if (!confirm('确定要删除这个配置吗？')) return;

    const configs = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    const configName = configs[index].name;

    // 获取当前显示的配置项并添加删除动画
    const modalBody = document.getElementById('modalBody');
    const configItems = modalBody.querySelectorAll('.saved-config-item');

    if (configItems[index]) {
        const item = configItems[index];
        item.style.transition = 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)';
        item.style.transform = 'translateX(-100px) scale(0.9)';
        item.style.opacity = '0';
        item.style.maxHeight = '0';
        item.style.margin = '0';
        item.style.padding = '0';

        setTimeout(() => {
            configs.splice(index, 1);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(configs));

            showNotification(`配置 "${configName}" 已删除`, 'success');
            loadConfig(); // 刷新列表
        }, 300);
    } else {
        // 如果找不到元素，直接执行
        configs.splice(index, 1);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(configs));

        showNotification(`配置 "${configName}" 已删除`, 'success');
        loadConfig(); // 刷新列表
    }
}

// 导出到Excel (CSV格式) - 带导出动画
function exportToExcel() {
    if (state.selectedServices.length === 0) {
        showNotification('没有数据需要导出', 'error');

        // 错误动画效果
        const resultPanel = document.querySelector('.result-panel');
        if (resultPanel) {
            resultPanel.style.animation = 'shake 0.4s ease-in-out';
            setTimeout(() => resultPanel.style.animation = '', 400);
        }
        return;
    }

    const exportBtn = event ? event.target : null;
    if (exportBtn) {
        exportBtn.style.animation = 'pulse-btn 0.6s ease-in-out';
        exportBtn.textContent = '⏳ 导出中...';
    }

    setTimeout(() => {
        const month = state.month;
        const discount = state.discount;
        const hasYearlyService = state.selectedServices.some(s => s.billingType === 'yearly');

        // CSV头部
        let csv = '分类,服务名称,配置,数量,计费方式,单价,小计(原价),折扣后,是否折扣\n';

        let originalTotal = 0;
        let discountTotal = 0;

        // CSV数据行
        state.selectedServices.forEach(service => {
            let basePrice;
            let billingMode;
            let unitPriceDisplay;
            let quantityDisplay;

            // 根据计费模式计算基础价格
            if (service.billingType === 'yearly') {
                // 按年计费：单价 × 数量 × 年数（以月数折算）
                const years = Math.ceil(month / 12);
                basePrice = preciseMultiply(service.price, service.quantity * years);
                billingMode = '按年计费';
                unitPriceDisplay = `¥${service.price.toFixed(2)}/年`;
                quantityDisplay = `${service.quantity}${service.unit} × ${years}年`;
            } else {
                // 按月计费：单价 × 数量 × 月数
                basePrice = preciseMultiply(service.price, service.quantity * month);
                billingMode = '按月计费';
                unitPriceDisplay = `¥${service.price.toFixed(2)}/月`;
                quantityDisplay = `${service.quantity}${service.unit} × ${month}个月`;
            }

            const discountedPrice = service.discount ? preciseMultiply(basePrice, 0.85) : basePrice;
            const finalPrice = discount ? discountedPrice : basePrice;

            originalTotal = preciseAdd(originalTotal, basePrice);
            discountTotal = preciseAdd(discountTotal, discountedPrice);

            const config = service.configName || service.name;
            const discountStatus = service.discount ? '是' : '否';

            // 转义字段，防止逗号干扰
            const name = `"${service.name}"`;
            const configField = `"${config}"`;

            csv += `${service.category},${name},${configField},${quantityDisplay},${billingMode},${unitPriceDisplay},¥${basePrice.toFixed(2)},¥${finalPrice.toFixed(2)},${discountStatus}\n`;
        });

        // 汇总行
        csv += '\n汇总信息\n';
        csv += `计费周期,${month}个月`;
        if (hasYearlyService) {
            csv += ' (含按年计费服务)';
        }
        csv += '\n';
        csv += `原价总计,¥${originalTotal.toFixed(2)}\n`;
        if (discount) {
            csv += `折扣后总计,¥${discountTotal.toFixed(2)}\n`;
            csv += `节省金额,¥${preciseAdd(originalTotal, -discountTotal).toFixed(2)}\n`;
        } else {
            csv += `应付总计,¥${originalTotal.toFixed(2)}\n`;
        }
        csv += `计算时间,${new Date().toLocaleString('zh-CN')}\n`;

        // 创建Blob并下载
        const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `开投智云报价_${new Date().toISOString().slice(0, 10)}.csv`;
        link.click();
        URL.revokeObjectURL(url);

        // 恢复按钮状态
        if (exportBtn) {
            setTimeout(() => {
                exportBtn.style.animation = '';
                exportBtn.textContent = '📊 导出Excel';
            }, 500);
        }

        showNotification('Excel文件已下载', 'success');
    }, 300);
}

// 导出到JSON - 带导出动画
function exportToJSON() {
    if (state.selectedServices.length === 0) {
        showNotification('没有数据需要导出', 'error');

        // 错误动画效果
        const resultPanel = document.querySelector('.result-panel');
        if (resultPanel) {
            resultPanel.style.animation = 'shake 0.4s ease-in-out';
            setTimeout(() => resultPanel.style.animation = '', 400);
        }
        return;
    }

    const exportBtn = event ? event.target : null;
    if (exportBtn) {
        exportBtn.style.animation = 'pulse-btn 0.6s ease-in-out';
        exportBtn.textContent = '⏳ 导出中...';
    }

    setTimeout(() => {
        const month = state.month;
        const discount = state.discount;

        const exportData = {
            timestamp: new Date().toISOString(),
            month: state.month,
            discount: state.discount,
            summary: {
                originalTotal: 0,
                discountTotal: 0,
                finalTotal: 0,
                savings: 0
            },
            services: state.selectedServices.map(service => {
                let basePrice;
                let billingMode;
                let quantity = service.quantity;
                let unit = service.unit;

                // 根据计费模式计算基础价格
                if (service.billingType === 'yearly') {
                    // 按年计费：单价 × 数量 × 年数（以月数折算）
                    const years = Math.ceil(month / 12);
                    basePrice = preciseMultiply(service.price, service.quantity * years);
                    billingMode = 'yearly';
                } else {
                    // 按月计费：单价 × 数量 × 月数
                    basePrice = preciseMultiply(service.price, service.quantity * month);
                    billingMode = 'monthly';
                }

                const discountedPrice = service.discount ? preciseMultiply(basePrice, 0.85) : basePrice;
                const finalPrice = discount ? discountedPrice : basePrice;

                // Redis缓存额外信息
                if (service.type === 'redis_master' || service.type === 'redis_cluster') {
                    unit = 'GB';
                }

                return {
                    category: service.category,
                    name: service.name,
                    code: service.code,
                    config: service.configName || null,
                    quantity: quantity,
                    unit: unit,
                    price: service.price,
                    billingType: service.billingType || 'monthly',
                    billingMode: billingMode,
                    // Redis缓存额外信息
                    nodeCount: service.nodeCount || null,
                    capacity: service.capacity || null,
                    originalTotal: basePrice,
                    discountedTotal: discountedPrice,
                    finalTotal: finalPrice,
                    discount: service.discount,
                    type: service.type || 'standard'
                };
            })
        };

        // 计算汇总
        let originalTotal = 0;
        let discountTotal = 0;

        state.selectedServices.forEach(service => {
            let basePrice;

            if (service.billingType === 'yearly') {
                // 按年计费：单价 × 数量 × 年数（以月数折算）
                const years = Math.ceil(month / 12);
                basePrice = preciseMultiply(service.price, service.quantity * years);
            } else {
                basePrice = preciseMultiply(service.price, service.quantity * month);
            }

            const discountedPrice = service.discount ? preciseMultiply(basePrice, 0.85) : basePrice;

            originalTotal = preciseAdd(originalTotal, basePrice);
            discountTotal = preciseAdd(discountTotal, discountedPrice);
        });

        exportData.summary.originalTotal = originalTotal;
        exportData.summary.discountTotal = discountTotal;
        exportData.summary.finalTotal = discount ? discountTotal : originalTotal;
        exportData.summary.savings = preciseAdd(originalTotal, -discountTotal);

        // 创建Blob并下载
        const jsonStr = JSON.stringify(exportData, null, 2);
        const blob = new Blob([jsonStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `开投智云报价_${new Date().toISOString().slice(0, 10)}.json`;
        link.click();
        URL.revokeObjectURL(url);

        // 恢复按钮状态
        if (exportBtn) {
            setTimeout(() => {
                exportBtn.style.animation = '';
                exportBtn.textContent = '💾 导出JSON';
            }, 500);
        }

        showNotification('JSON文件已下载', 'success');
    }, 300);
}

// 主题切换 - 带切换动画
function toggleTheme() {
    const html = document.documentElement;
    const isDark = html.classList.contains('dark');

    // 添加过渡动画 - 使用CSS变量避免布局变化
    document.body.style.transition = 'all 0.4s ease';

    setTimeout(() => {
        if (isDark) {
            html.classList.remove('dark');
            localStorage.setItem('ktjk_theme', 'light');
            showNotification('✨ 已切换到日间模式', 'info');
        } else {
            html.classList.add('dark');
            localStorage.setItem('ktjk_theme', 'dark');
            showNotification('🌙 已切换到夜间模式', 'info');
        }

        // 恢复并添加光效
        document.body.style.filter = 'brightness(1)';

        // 主题切换的额外视觉反馈 - 固定宽高避免变形
        const themeBtn = document.getElementById('themeToggle');
        if (themeBtn) {
            themeBtn.style.animation = 'spin 0.6s ease-in-out';
            setTimeout(() => themeBtn.style.animation = '', 600);
        }
    }, 200);
}

// 加载主题
function loadTheme() {
    const savedTheme = localStorage.getItem('ktjk_theme');
    if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark');
    }
}

// 设置事件监听器 - 增强版（添加视觉反馈和涟漪效果）
function setupEventListeners() {
    // 月份输入 - 带数字动画
    document.getElementById('monthInput').addEventListener('input', function(e) {
        let value = parseInt(e.target.value);
        if (isNaN(value) || value < 1) value = 1;
        if (value > 120) value = 120;
        e.target.value = value;
        state.month = value;
        updateResult();

        // 添加输入反馈动画
        e.target.style.transform = 'scale(1.05)';
        e.target.style.borderColor = 'var(--primary-500)';
        setTimeout(() => {
            e.target.style.transform = '';
            e.target.style.borderColor = '';
        }, 150);
    });

    // 折扣率输入 - 带数字动画
    document.getElementById('discountInput').addEventListener('input', function(e) {
        let value = parseInt(e.target.value);
        if (isNaN(value) || value < 0) value = 0;
        if (value > 100) value = 100;
        e.target.value = value;
        state.discountRate = value;
        updateResult();

        // 添加输入反馈和颜色变化
        e.target.style.transform = 'scale(1.05)';
        e.target.style.backgroundColor = value > 0 ? 'rgba(16, 185, 129, 0.1)' : '';
        e.target.style.borderColor = value > 0 ? 'var(--success-500)' : '';
        setTimeout(() => {
            e.target.style.transform = '';
            e.target.style.backgroundColor = '';
            e.target.style.borderColor = '';
        }, 150);
    });

    // 主题切换 - 添加涟漪
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', function(e) {
            toggleTheme();
            createRipple(e, this);
        });
    }

    // 模态框关闭
    const modal = document.getElementById('modal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal();
            }
        });
    }

    // 绑定所有按钮的涟漪效果（通过 onclick 的按钮）
    setTimeout(() => {
        bindRippleEffectToButtons();
    }, 200);
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', init);
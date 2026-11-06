import { ref, computed, onMounted, onUnmounted } from 'vue'

export function useEggSort() {
  // Theme state: 'light' or 'dark'
  const theme = ref(localStorage.getItem('eggsort_theme') || 'light')

  const applyTheme = (newTheme) => {
    theme.value = newTheme
    localStorage.setItem('eggsort_theme', newTheme)
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  const toggleTheme = () => {
    applyTheme(theme.value === 'dark' ? 'light' : 'dark')
  }

  // System & Telemetry State
  const isAutoMode = ref(true)
  const isEmergencyStop = ref(false)
  const streamMode = ref('top') // 'top' (cangkang luar) or 'candling' (peneropongan)
  const isLedOn = ref(true)
  const fps = ref(29.8)
  const latency = ref(14)
  const inferenceTime = ref(14.2)
  const mqttFreq = ref(108)
  const activeTab = ref('dashboard') // 'dashboard', 'history', 'calibration', 'settings', 'profile'
  const filterGrade = ref('ALL') // 'ALL', 'GRADE A', 'GRADE B', 'REJECT'
  const isSnapshotting = ref(false)
  const toastMessage = ref('')
  const showToast = ref(false)

  const triggerToast = (msg) => {
    toastMessage.value = msg
    showToast.value = true
    setTimeout(() => {
      showToast.value = false
    }, 3000)
  }

  // Operator Profile State
  const operatorProfile = ref({
    fullName: 'Ahmad Fauzi',
    titleDegree: '',
    roleTag: 'Aktif',
    email: 'operator@polije.ac.id',
    phone: '+62 812-3456-7890',
    shift: 'Operator Workstation',
    institution: 'Politeknik Negeri Jember',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
    workstation: 'Chrome di Linux / Workstation #03',
    ipAddress: '192.168.1.104 • Jember, Indonesia',
    loginTime: 'Hari ini pukul 07:02 WIB (Aktif Sekarang)'
  })

  const updateProfile = (newData) => {
    operatorProfile.value = { ...operatorProfile.value, ...newData }
    triggerToast('Profil operator berhasil diperbarui!')
  }

  // KPI Statistics
  const totalScanned = ref(1428)
  const gradeACount = ref(1085)
  const gradeBCount = ref(247)
  const rejectCount = ref(96)
  const speedPerMin = ref(45)
  const rejectCapacity = ref(12)

  const gradeAPercent = computed(() => {
    if (!totalScanned.value) return '0.0'
    return ((gradeACount.value / totalScanned.value) * 100).toFixed(1)
  })

  const gradeBPercent = computed(() => {
    if (!totalScanned.value) return '0.0'
    return ((gradeBCount.value / totalScanned.value) * 100).toFixed(1)
  })

  const rejectPercent = computed(() => {
    if (!totalScanned.value) return '0.0'
    return ((rejectCount.value / totalScanned.value) * 100).toFixed(1)
  })

  // Current Egg Realtime Inspection
  const currentEgg = ref({
    eggId: '#EGG-1428',
    grade: 'GRADE A',
    gradeLabel: 'LAYAK KONSUMSI / PRIMA',
    confidence: 98.42,
    svmProbability: 0.984,
    actuator: 'Gate 1 (Solenoid Piston → Jalur Grade A)',
    triggerTime: '135ms',
    yoloDefectClass: 'Nihil',
    yoloDefectScore: 0.01,
    length: 58.2,
    lengthPx: 412,
    width: 43.1,
    widthPx: 305,
    shapeIndex: 74.05,
    meanBrightness: 142.6,
    airDepthCm: 0.32,
    shellIntegrity: 'Bersih',
    shellIntegritySub: 'Tanpa Kerusakan / Normal',
    internalHaugh: 'HU - 82',
    internalHaughSub: 'Kualitas Segar AA / Transparan',
    criteria: [
      {
        title: 'Cangkang Utuh',
        desc: 'Tidak terdeteksi retak atau noda darah (YOLOv8 Defect Score 0.01 < batas 0.25)',
        passed: true
      },
      {
        title: 'Bentuk Proporsional',
        desc: 'Nilai Shape Index 74.05% berada tepat dalam standar mutu SNI (72% - 76%)',
        passed: true
      },
      {
        title: 'Kantung Udara & Kuning Telur',
        desc: 'Densitas cahaya candling stabil, Mean Brightness 142.6 (kantung udara < 0.5cm)',
        passed: true
      }
    ]
  })

  // Scan Log History
  const scanLogs = ref([
    {
      time: '10:42:19',
      eggId: '#EGG-1428',
      dimensions: '58.2 × 43.1 mm',
      shapeIndex: '74.05%',
      meanBrightness: '142.6',
      defectDetection: '✔ Nihil (0.01)',
      defectType: 'good',
      finalGrade: 'GRADE A',
      actuator: 'Gate 1 → Bin A'
    },
    {
      time: '10:42:16',
      eggId: '#EGG-1427',
      dimensions: '57.9 × 43.4 mm',
      shapeIndex: '74.95%',
      meanBrightness: '139.2',
      defectDetection: '✔ Nihil (0.01)',
      defectType: 'good',
      finalGrade: 'GRADE A',
      actuator: 'Gate 1 → Bin A'
    },
    {
      time: '10:42:14',
      eggId: '#EGG-1426',
      dimensions: '62.1 × 42.0 mm',
      shapeIndex: '67.63%',
      meanBrightness: '134.0',
      defectDetection: '⊘ SI Lonjong',
      defectType: 'dirt',
      finalGrade: 'GRADE B',
      actuator: 'Gate 2 → Bin B'
    },
    {
      time: '10:42:12',
      eggId: '#EGG-1425',
      dimensions: '54.0 × 44.8 mm',
      shapeIndex: '82.96%',
      meanBrightness: '112.4',
      defectDetection: '⚠ Retak Mikro (0.89)',
      defectType: 'cracked',
      finalGrade: 'REJECT',
      actuator: 'Reject Ejector → Akhir'
    },
    {
      time: '10:42:10',
      eggId: '#EGG-1424',
      dimensions: '58.5 × 43.6 mm',
      shapeIndex: '74.52%',
      meanBrightness: '144.1',
      defectDetection: '✔ Nihil (0.01)',
      defectType: 'good',
      finalGrade: 'GRADE A',
      actuator: 'Gate 1 → Bin A'
    }
  ])

  const filteredLogs = computed(() => {
    if (filterGrade.value === 'ALL') return scanLogs.value
    return scanLogs.value.filter(log => log.finalGrade === filterGrade.value)
  })

  // Action Handlers
  const toggleAutoMode = () => {
    isAutoMode.value = !isAutoMode.value
    triggerToast(isAutoMode.value ? 'Mesin Berjalan (Mode Otomatis Aktif)' : 'Mesin Dihentikan (Stop Mesin)')
  }

  const triggerEmergencyStop = () => {
    isEmergencyStop.value = !isEmergencyStop.value
    if (isEmergencyStop.value) {
      isAutoMode.value = false
      triggerToast('⚠ EMERGENCY STOP DIAKTIFKAN! Konveyor & aktuator berhenti.')
    } else {
      triggerToast('Emergency Stop dilepas. Silakan aktifkan kembali mode otomatis.')
    }
  }

  const resetSession = () => {
    if (confirm('Apakah Anda yakin ingin me-reset sesi penghitungan telur?')) {
      totalScanned.value = 0
      gradeACount.value = 0
      gradeBCount.value = 0
      rejectCount.value = 0
      rejectCapacity.value = 0
      scanLogs.value = []
      triggerToast('Sesi pemindaian berhasil di-reset ke nol.')
    }
  }

  const toggleStreamMode = () => {
    streamMode.value = streamMode.value === 'top' ? 'candling' : 'top'
    triggerToast(streamMode.value === 'top' ? 'Beralih ke Kamera Top-Light (Cangkang)' : 'Beralih ke Kamera Candling (Interior)')
  }

  const takeSnapshot = () => {
    isSnapshotting.value = true
    triggerToast(`Snapshot ${currentEgg.value.eggId} berhasil disimpan ke storage.`)
    setTimeout(() => {
      isSnapshotting.value = false
    }, 400)
  }

  const exportCSV = () => {
    if (!scanLogs.value.length) {
      triggerToast('Tidak ada data log untuk diekspor.')
      return
    }
    const headers = ['Waktu', 'ID Telur', 'Dimensi (P x L)', 'Shape Index (%)', 'Mean Brightness', 'Deteksi Cacat', 'Grade Akhir', 'Aksi Aktuator']
    const rows = scanLogs.value.map(log => [
      `"${log.time}"`,
      `"${log.eggId}"`,
      `"${log.dimensions}"`,
      `"${log.shapeIndex}"`,
      `"${log.meanBrightness}"`,
      `"${log.defectDetection}"`,
      `"${log.finalGrade}"`,
      `"${log.actuator}"`
    ])
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `EggSort_Log_${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    triggerToast('File CSV berhasil diunduh.')
  }

  // Simulation Engine
  let simInterval = null
  let fpsInterval = null

  const sampleVariations = [
    {
      grade: 'GRADE A',
      gradeLabel: 'LAYAK KONSUMSI / PRIMA',
      conf: 98.7,
      svm: 0.987,
      actuator: 'Gate 1 (Solenoid Piston → Jalur Grade A)',
      actuatorTable: 'Gate 1 → Bin A',
      defectDetection: '✔ Nihil (0.01)',
      defectType: 'good',
      lengthRange: [57.0, 59.5],
      widthRange: [42.5, 44.0],
      brightnessRange: [138, 146],
      airDepth: 0.3,
      haugh: 'HU - 84',
      passed: [true, true, true],
      c1: 'Tidak terdeteksi retak atau noda darah (YOLOv8 Defect Score 0.01 < batas 0.25)',
      c2: 'Nilai Shape Index dalam standar mutu SNI (72% - 76%)',
      c3: 'Densitas cahaya candling stabil, kantung udara < 0.5cm'
    },
    {
      grade: 'GRADE A',
      gradeLabel: 'LAYAK KONSUMSI / PRIMA',
      conf: 97.9,
      svm: 0.979,
      actuator: 'Gate 1 (Solenoid Piston → Jalur Grade A)',
      actuatorTable: 'Gate 1 → Bin A',
      defectDetection: '✔ Nihil (0.02)',
      defectType: 'good',
      lengthRange: [56.8, 58.8],
      widthRange: [42.8, 43.8],
      brightnessRange: [140, 148],
      airDepth: 0.35,
      haugh: 'HU - 81',
      passed: [true, true, true],
      c1: 'Cangkang bersih dan utuh sempurna tanpa celah mikro',
      c2: 'Proporsi lebar terhadap panjang elips ideal sesuai SNI',
      c3: 'Transparansi cairan jernih, kantung udara normal < 0.5cm'
    },
    {
      grade: 'GRADE B',
      gradeLabel: 'TOLERANSI NORMAL / INDUSTRI',
      conf: 94.2,
      svm: 0.942,
      actuator: 'Gate 2 (Solenoid Piston → Jalur Grade B)',
      actuatorTable: 'Gate 2 → Bin B',
      defectDetection: '⊘ Noda Cangkang Ringan (0.28)',
      defectType: 'dirt',
      lengthRange: [59.0, 62.5],
      widthRange: [41.0, 42.5],
      brightnessRange: [130, 137],
      airDepth: 0.65,
      haugh: 'HU - 71',
      passed: [false, true, true],
      c1: 'Terdapat noda ringan pada permukaan kerabang (YOLOv8 Score 0.28)',
      c2: 'Bentuk proporsional sesuai rentang toleransi komersial',
      c3: 'Kantung udara 0.5 - 0.9cm (masuk kategori Mutu II SNI)'
    },
    {
      grade: 'REJECT',
      gradeLabel: 'CACAT FISIK / TIDAK LAYAK',
      conf: 99.1,
      svm: 0.991,
      actuator: 'Reject Ejector → Penampung Cacat',
      actuatorTable: 'Reject Ejector → Akhir',
      defectDetection: '⚠ Retakan Rambut (0.91)',
      defectType: 'cracked',
      lengthRange: [53.5, 56.0],
      widthRange: [43.0, 45.5],
      brightnessRange: [105, 120],
      airDepth: 1.05,
      haugh: 'HU - 54',
      passed: [false, false, false],
      c1: 'Terdeteksi retak rambut (cracked) kritis pada dinding cangkang',
      c2: 'Bentuk abnormal atau kantung udara melebihi ambang batas (> 0.9cm)',
      c3: 'Kekeruhan candling tinggi / indikasi penurunan mutu berat'
    }
  ]

  const spawnEgg = () => {
    if (!isAutoMode.value || isEmergencyStop.value) return

    totalScanned.value += 1
    const rand = Math.random()
    let chosen
    if (rand < 0.75) {
      chosen = sampleVariations[Math.random() < 0.5 ? 0 : 1]
      gradeACount.value += 1
    } else if (rand < 0.90) {
      chosen = sampleVariations[2]
      gradeBCount.value += 1
    } else {
      chosen = sampleVariations[3]
      rejectCount.value += 1
      rejectCapacity.value = Math.min(100, rejectCapacity.value + 1)
    }

    const randLen = +(chosen.lengthRange[0] + Math.random() * (chosen.lengthRange[1] - chosen.lengthRange[0])).toFixed(1)
    const randWid = +(chosen.widthRange[0] + Math.random() * (chosen.widthRange[1] - chosen.widthRange[0])).toFixed(1)
    const si = +((randWid / randLen) * 100).toFixed(2)
    const bright = +(chosen.brightnessRange[0] + Math.random() * (chosen.brightnessRange[1] - chosen.brightnessRange[0])).toFixed(1)
    const now = new Date()
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`
    const eggIdStr = `#EGG-${totalScanned.value}`

    currentEgg.value = {
      eggId: eggIdStr,
      grade: chosen.grade,
      gradeLabel: chosen.gradeLabel,
      confidence: chosen.conf,
      svmProbability: chosen.svm,
      actuator: chosen.actuator,
      triggerTime: `${Math.floor(125 + Math.random() * 25)}ms`,
      yoloDefectClass: chosen.defectType,
      yoloDefectScore: chosen.defectType === 'good' ? 0.01 : (chosen.defectType === 'dirt' ? 0.28 : 0.91),
      length: randLen,
      lengthPx: Math.round(randLen * 7.1),
      width: randWid,
      widthPx: Math.round(randWid * 7.1),
      shapeIndex: si,
      meanBrightness: bright,
      airDepthCm: chosen.airDepth,
      shellIntegrity: chosen.grade === 'GRADE A' ? 'Bersih' : (chosen.grade === 'GRADE B' ? 'Sedikit Noda' : 'Retak'),
      shellIntegritySub: chosen.grade === 'GRADE A' ? 'Tanpa Kerusakan / Normal' : (chosen.grade === 'GRADE B' ? 'Noda Ringan Cangkang' : 'Cacat Retak Kerabang'),
      internalHaugh: chosen.haugh,
      internalHaughSub: chosen.grade === 'GRADE A' ? 'Kualitas Segar AA / Transparan' : (chosen.grade === 'GRADE B' ? 'Kualitas Mutu II / Konsumsi' : 'Tidak Layak Konsumsi'),
      criteria: [
        { title: 'Cangkang Utuh', desc: chosen.c1, passed: chosen.passed[0] },
        { title: 'Bentuk Proporsional', desc: `Shape Index ${si}% - ${chosen.c2}`, passed: chosen.passed[1] },
        { title: 'Kantung Udara & Kuning Telur', desc: chosen.c3, passed: chosen.passed[2] }
      ]
    }

    scanLogs.value.unshift({
      time: timeStr,
      eggId: eggIdStr,
      dimensions: `${randLen} × ${randWid} mm`,
      shapeIndex: `${si}%`,
      meanBrightness: `${bright}`,
      defectDetection: chosen.defectDetection,
      defectType: chosen.defectType,
      finalGrade: chosen.grade,
      actuator: chosen.actuatorTable
    })

    if (scanLogs.value.length > 25) {
      scanLogs.value.pop()
    }
  }

  onMounted(() => {
    applyTheme(theme.value)

    fpsInterval = setInterval(() => {
      fps.value = +(29.5 + Math.random() * 0.8).toFixed(1)
      latency.value = Math.floor(13 + Math.random() * 3)
      inferenceTime.value = +(13.8 + Math.random() * 1.4).toFixed(1)
    }, 2000)

    simInterval = setInterval(spawnEgg, 3800)
  })

  onUnmounted(() => {
    if (simInterval) clearInterval(simInterval)
    if (fpsInterval) clearInterval(fpsInterval)
  })

  return {
    theme,
    toggleTheme,
    isAutoMode,
    toggleAutoMode,
    isEmergencyStop,
    triggerEmergencyStop,
    streamMode,
    toggleStreamMode,
    isLedOn,
    fps,
    latency,
    inferenceTime,
    mqttFreq,
    activeTab,
    filterGrade,
    isSnapshotting,
    toastMessage,
    showToast,
    triggerToast,
    operatorProfile,
    updateProfile,
    totalScanned,
    speedPerMin,
    gradeACount,
    gradeBCount,
    rejectCount,
    gradeAPercent,
    gradeBPercent,
    rejectPercent,
    rejectCapacity,
    currentEgg,
    scanLogs,
    filteredLogs,
    resetSession,
    takeSnapshot,
    exportCSV
  }
}

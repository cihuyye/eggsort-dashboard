import { ref, computed, onMounted, onUnmounted } from 'vue'
import { eggApiService } from '../services/eggApiService'

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

  // API Backend States (Integrasi Flask API D:\Egg Sorting System\app_flask.py)
  const apiOnline = ref(false)
  const apiDevice = ref('cpu')
  const apiLoading = ref(false)
  const apiUrl = ref(eggApiService.getBaseUrl())

  const triggerToast = (msg) => {
    toastMessage.value = msg
    showToast.value = true
    setTimeout(() => {
      showToast.value = false
    }, 3500)
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
    gradeLabel: 'MUTU I: KONSUMSI SEGAR / SUPER',
    confidence: 98.42,
    yoloProbability: 0.984,
    actuator: 'Gate 1 (Solenoid Piston → Jalur Kemasan Ritel Mutu I)',
    sniAction: 'Layak konsumsi langsung segar (Pasal 8 & 9 SNI). Kemas ke wadah ritel resmi berlabel. Simpan suhu ruang ≤ 30°C (Pasal 10).',
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
    shellIntegritySub: 'Utuh, Halus, Tebal, Bebas Noda (SNI 3926:2023 Tabel 1)',
    internalHaugh: 'HU - 82',
    internalHaughSub: 'Kualitas Segar Mutu I / Kuning Telur di Tengah',
    imageUrl: null,
    detections: [],
    criteria: [
      {
        title: 'Keutuhan & Kebersihan Kerabang',
        desc: 'Cangkang utuh & bersih tanpa retak (YOLOv8-seg Score 0.01 < ambang 0.25 - SNI Tabel 1)',
        passed: true
      },
      {
        title: 'Indeks Bentuk (SI 72% - 76%)',
        desc: 'Nilai Shape Index 74.05% berada tepat dalam standar mutu SNI (72% - 76%)',
        passed: true
      },
      {
        title: 'Kantung Udara & Candling (< 0.5 cm)',
        desc: 'Kedalaman kantung udara 0.32 cm tetap di tempat, bebas bercak darah / benda asing',
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
    // Modal konfirmasi sekarang handled by ResetSessionModal di SubHeader.vue
    totalScanned.value = 0
    gradeACount.value = 0
    gradeBCount.value = 0
    rejectCount.value = 0
    rejectCapacity.value = 0
    scanLogs.value = []
    triggerToast('Sesi pemindaian berhasil di-reset ke nol.')
  }

  const toggleStreamMode = () => {
    streamMode.value = streamMode.value === 'top' ? 'candling' : 'top'
    triggerToast(streamMode.value === 'top' ? 'Beralih ke Kamera Top-Light (Cangkang)' : 'Beralih ke Kamera Candling (Interior)')
  }

  const takeSnapshot = () => {
    isSnapshotting.value = true
    triggerToast(`Snapshot ${currentEgg.value.eggId} berhasil diambil & diproses.`)
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
    // Toast success notification handled by ScanLogTable.vue
  }

  // Jeda simulasi sementara saat scan foto real aktif
  let pauseSimulationTimer = null
  const pauseSimulation = (ms = 25000) => {
    if (pauseSimulationTimer) clearTimeout(pauseSimulationTimer)
    pauseSimulationTimer = setTimeout(() => {
      pauseSimulationTimer = null
    }, ms)
  }

  // ============================================================================
  // INTEGRASI API REALTIME (FLASK BACKEND YOLOv8-seg + OPENCV)
  // ============================================================================
  const checkApiHealth = async () => {
    const res = await eggApiService.checkHealth()
    apiOnline.value = res.online
    if (res.online && res.data) {
      apiDevice.value = res.data.device || 'cpu'
    }
  }

  // Fungsi utama untuk memproses citra telur dari kamera atau upload
  const scanRealEgg = async (files, previewUrl = null) => {
    apiLoading.value = true
    pauseSimulation(30000) // Tahan simulasi agar hasil citra real tidak langsung tertimpa

    try {
      const res = await eggApiService.predictEgg(files)
      const summary = res.summary_360 || {}
      const geo = res.opencv_geometry_inspection || {}
      const decision = res.final_grading_decision || {}
      const angles = res.angles || []

      // Mapping grade SNI ke label UI dashboard
      const code = decision.grade_code || 'MUTU_I'

      if (res.is_egg === false || code === 'NOT_EGG') {
        triggerToast('⚠️ Peringatan: Objek pada citra tidak terdeteksi sebagai telur ayam valid.')
        return res
      }

      let mappedGrade = 'GRADE A'
      let mappedLabel = 'LAYAK KONSUMSI / PRIMA'

      if (code === 'MUTU_I') {
        mappedGrade = 'GRADE A'
        mappedLabel = 'MUTU I / PRIMA (SNI 3926:2023)'
        gradeACount.value += 1
      } else if (code === 'MUTU_II') {
        mappedGrade = 'GRADE B'
        mappedLabel = 'MUTU II / KOMERSIAL'
        gradeBCount.value += 1
      } else {
        mappedGrade = 'REJECT'
        mappedLabel = 'MUTU III / REJECT'
        rejectCount.value += 1
        rejectCapacity.value = Math.min(100, rejectCapacity.value + 1)
      }

      totalScanned.value += 1

      const now = new Date()
      const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`
      const eggIdStr = `#EGG-${totalScanned.value}`

      const dominantDefect = summary.dominant_defect || 'good'
      const confScore = +(summary.confidence ? summary.confidence * 100 : 98.0).toFixed(1)

      // Ambil bounding boxes jika ada
      const detections = angles.length > 0 ? (angles[0].detections || []) : []

      // Update currentEgg state
      currentEgg.value = {
        eggId: eggIdStr,
        grade: mappedGrade,
        gradeLabel: mappedGrade === 'GRADE A'
          ? 'MUTU I: KONSUMSI SEGAR / SUPER'
          : (mappedGrade === 'GRADE B'
            ? 'MUTU II: KONSUMSI REGULER / INDUSTRI OLAHAN'
            : 'TIDAK MEMENUHI SYARAT: CACAT KERABANG / RETAK'),
        confidence: confScore,
        yoloProbability: summary.confidence || 0.98,
        actuator: decision.hardware_sorting_action || (
          mappedGrade === 'GRADE A'
            ? 'Gate 1 (Solenoid Piston → Jalur Kemasan Ritel Mutu I)'
            : (mappedGrade === 'GRADE B'
              ? 'Gate 2 (Solenoid Piston → Jalur Industri Pangan Mutu II)'
              : 'Reject Ejector (Pneumatik → Penampung Karantina Afkir)')
        ),
        sniAction: mappedGrade === 'GRADE A'
          ? 'Layak konsumsi langsung segar (Pasal 8 & 9 SNI). Kemas ke wadah ritel resmi berlabel, simpan pada suhu ruang ≤ 30°C (Pasal 10).'
          : (mappedGrade === 'GRADE B'
            ? 'Lolos konsumsi reguler & bahan baku industri pangan (bakery/mie). Sanitasi kering noda kerabang ≤ 1/32 (Tabel 1 SNI). Prioritaskan perputaran cepat.'
            : 'Dilarang diedarkan sebagai telur segar utuh (Tabel 1 & 2 SNI). Cacat kerabang tidak utuh rawan cemaran patogen Salmonella spp. Alihkan ke karantina afkir.'),
        triggerTime: `${res.clientLatencyMs || 15}ms`,
        yoloDefectClass: dominantDefect,
        yoloDefectScore: summary.confidence || 0.01,
        length: geo.length_mm || 56.5,
        lengthPx: Math.round((geo.length_mm || 56.5) * 7.1),
        width: geo.width_mm || 43.2,
        widthPx: Math.round((geo.width_mm || 43.2) * 7.1),
        shapeIndex: geo.esi_percentage || 76.5,
        meanBrightness: 142.0,
        airDepthCm: 0.35,
        shellIntegrity: dominantDefect === 'good' ? 'Bersih & Utuh' : (dominantDefect === 'dirt' ? 'Noda Cangkang' : 'Retak Cangkang'),
        shellIntegritySub: summary.notes || decision.reason || 'Kondisi kerabang normal',
        internalHaugh: mappedGrade === 'GRADE A' ? 'HU - 84' : (mappedGrade === 'GRADE B' ? 'HU - 72' : 'HU - 52'),
        internalHaughSub: mappedGrade === 'GRADE A' ? 'Kualitas Segar AA' : (mappedGrade === 'GRADE B' ? 'Kualitas Mutu II' : 'Tidak Layak Konsumsi'),
        imageUrl: previewUrl || (files instanceof File ? URL.createObjectURL(files) : null),
        detections: detections,
        criteria: [
          {
            title: 'Keutuhan Cangkang (YOLOv8-seg)',
            desc: summary.notes || `Deteksi: ${dominantDefect.toUpperCase()} (${confScore}%)`,
            passed: dominantDefect === 'good'
          },
          {
            title: 'Geometri Bentuk (OpenCV)',
            desc: `Dimensi ${geo.length_mm} × ${geo.width_mm} mm (SI: ${geo.esi_percentage}% - ${geo.shape_status || 'Normal'})`,
            passed: (geo.esi_percentage >= 72 && geo.esi_percentage <= 80)
          },
          {
            title: 'Keputusan Mutu SNI 3926:2023',
            desc: decision.reason || 'Evaluasi standar SNI terpenuhi.',
            passed: (code !== 'MUTU_III')
          }
        ]
      }

      // Masukkan ke tabel scan log
      scanLogs.value.unshift({
        time: timeStr,
        eggId: eggIdStr,
        dimensions: `${geo.length_mm || 56.5} × ${geo.width_mm || 43.2} mm`,
        shapeIndex: `${geo.esi_percentage || 76.5}%`,
        meanBrightness: '142.0',
        defectDetection: dominantDefect === 'good' ? '✔ Utuh (0.01)' : (dominantDefect === 'dirt' ? `⊘ Kotor (${confScore}%)` : `⚠ Retak (${confScore}%)`),
        defectType: dominantDefect,
        finalGrade: mappedGrade,
        actuator: decision.hardware_sorting_action || mappedGrade
      })

      if (scanLogs.value.length > 25) {
        scanLogs.value.pop()
      }

      // Update telemetry
      latency.value = res.clientLatencyMs || 14
      inferenceTime.value = +(res.clientLatencyMs * 0.75).toFixed(1) || 12.0

      triggerToast(`[API AI] Hasil: ${mappedGrade} (${dominantDefect}) - ${decision.hardware_sorting_action || 'Sortir Selesai'}`)
      return res
    } catch (err) {
      console.error('[EggApi Error]:', err)
      triggerToast(`Gagal menghubungi API: ${err.message || 'Cek terminal app_api.py'}`)
      throw err
    } finally {
      apiLoading.value = false
    }
  }

  // Simulation Engine (Berjalan saat tidak ada interaksi foto real)
  let simInterval = null
  let fpsInterval = null
  let healthInterval = null

  const sampleVariations = [
    {
      grade: 'GRADE A',
      gradeLabel: 'MUTU I: KONSUMSI SEGAR / SUPER',
      conf: 98.7,
      yolo: 0.987,
      actuator: 'Gate 1 (Solenoid Piston → Jalur Kemasan Ritel Mutu I)',
      actuatorTable: 'Gate 1 → Ritel Mutu I',
      sniAction: 'Layak konsumsi langsung segar (Pasal 8 & 9 SNI). Kemas ke wadah ritel resmi berlabel, simpan suhu ruang ≤ 30°C / kelembaban ≤ 90% (Pasal 10).',
      defectDetection: '✔ Nihil (0.01)',
      defectType: 'good',
      lengthRange: [57.0, 59.5],
      widthRange: [42.5, 44.0],
      brightnessRange: [138, 146],
      airDepth: 0.3,
      haugh: 'HU - 84',
      passed: [true, true, true],
      c1: 'Cangkang utuh, bersih, bebas noda & retakan (SNI 3926:2023 Tabel 1)',
      c2: 'Nilai Shape Index normal dalam rentang SNI (72% - 76%)',
      c3: 'Kantung udara < 0.5 cm (sangat segar), kuning telur bulat di tengah'
    },
    {
      grade: 'GRADE A',
      gradeLabel: 'MUTU I: KONSUMSI SEGAR / SUPER',
      conf: 97.9,
      yolo: 0.979,
      actuator: 'Gate 1 (Solenoid Piston → Jalur Kemasan Ritel Mutu I)',
      actuatorTable: 'Gate 1 → Ritel Mutu I',
      sniAction: 'Layak konsumsi langsung segar (Pasal 8 & 9 SNI). Kemas ke wadah ritel resmi berlabel, simpan suhu ruang ≤ 30°C / kelembaban ≤ 90% (Pasal 10).',
      defectDetection: '✔ Nihil (0.02)',
      defectType: 'good',
      lengthRange: [56.8, 58.8],
      widthRange: [42.8, 43.8],
      brightnessRange: [140, 148],
      airDepth: 0.35,
      haugh: 'HU - 81',
      passed: [true, true, true],
      c1: 'Cangkang utuh, halus, tebal, bebas noda asing (SNI 3926:2023 Tabel 1)',
      c2: 'Proporsi lebar terhadap panjang elips ideal sesuai SNI (72% - 76%)',
      c3: 'Kantung udara 0.35 cm tetap di tempat, bebas bercak darah'
    },
    {
      grade: 'GRADE B',
      gradeLabel: 'MUTU II: KONSUMSI REGULER / INDUSTRI OLAHAN',
      conf: 94.2,
      yolo: 0.942,
      actuator: 'Gate 2 (Solenoid Piston → Jalur Industri Pangan Mutu II)',
      actuatorTable: 'Gate 2 → Industri Mutu II',
      sniAction: 'Lolos konsumsi reguler & bahan baku industri pangan/bakery. Sanitasi kering noda kerabang ≤ 1/32 (Tabel 1 SNI). Prioritaskan distribusi cepat.',
      defectDetection: '⊘ Noda Cangkang Ringan (0.28)',
      defectType: 'dirt',
      lengthRange: [59.0, 62.5],
      widthRange: [41.0, 42.5],
      brightnessRange: [130, 137],
      airDepth: 0.65,
      haugh: 'HU - 71',
      passed: [false, true, true],
      c1: 'Terdapat noda ringan cangkang (toleransi ≤ 1/32 permukaan kerabang SNI Tabel 1)',
      c2: 'Bentuk cangkang normal / toleransi komersial',
      c3: 'Kantung udara 0.5 - 0.9 cm (memenuhi syarat Mutu II SNI 3926:2023)'
    },
    {
      grade: 'REJECT',
      gradeLabel: 'TIDAK MEMENUHI SYARAT: CACAT KERABANG / RETAK',
      conf: 99.1,
      yolo: 0.991,
      actuator: 'Reject Ejector (Pneumatik → Penampung Karantina Afkir)',
      actuatorTable: 'Reject Ejector → Karantina',
      sniAction: 'Dilarang diedarkan sebagai telur segar utuh (Tabel 1 & 2 SNI). Cacat kerabang retak rawan cemaran patogen Salmonella spp. Alihkan ke karantina afkir.',
      defectDetection: '⚠ Retakan Rambut (0.91)',
      defectType: 'cracked',
      lengthRange: [53.5, 56.0],
      widthRange: [43.0, 45.5],
      brightnessRange: [105, 120],
      airDepth: 1.05,
      haugh: 'HU - 54',
      passed: [false, false, false],
      c1: 'Cangkang retak / tidak utuh (melanggar syarat keutuhan seluruh mutu SNI Tabel 1)',
      c2: 'Kantung udara > 0.9 cm / melebihi batas kesegaran konsumsi',
      c3: 'Kekeruhan candling tinggi / risiko kontaminasi mikroba patogen'
    }
  ]

  const spawnEgg = () => {
    if (!isAutoMode.value || isEmergencyStop.value || pauseSimulationTimer) return

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
      yoloProbability: chosen.yolo,
      actuator: chosen.actuator,
      sniAction: chosen.sniAction,
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
      imageUrl: null,
      detections: [],
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

    // Polling status API backend (FastAPI / Flask D:\Egg Sorting System)
    checkApiHealth()
    healthInterval = setInterval(checkApiHealth, 4000)

    fpsInterval = setInterval(() => {
      fps.value = +(29.5 + Math.random() * 0.8).toFixed(1)
      if (!apiOnline.value) {
        latency.value = Math.floor(13 + Math.random() * 3)
        inferenceTime.value = +(13.8 + Math.random() * 1.4).toFixed(1)
      }
    }, 2000)

    simInterval = setInterval(spawnEgg, 4200)
  })

  onUnmounted(() => {
    if (simInterval) clearInterval(simInterval)
    if (fpsInterval) clearInterval(fpsInterval)
    if (healthInterval) clearInterval(healthInterval)
    if (pauseSimulationTimer) clearTimeout(pauseSimulationTimer)
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
    exportCSV,
    // API State & Handlers
    apiOnline,
    apiDevice,
    apiLoading,
    apiUrl,
    scanRealEgg,
    checkApiHealth
  }
}

export const AppConstants = {
  displayLogs: true,
  isProdMode: true,
  appTopMenuHeight: 50,
  thumbnailPrefix:'thumb_',
  userProfilePrefix:'userProfile_',
  userDetails:{
    name:'name'
  },
  registration:{
    isLoggedIn: 'isLoggedIn',
    userKey:'userKey',
    userName: 'userName',
    password: 'password',
    email: 'email',
    nickName: 'nickName'
  },
  calendar: {
    format: 'YYYY-MM-DD',
    dataTypes: {
      string: 'string',
      jsDate: 'js-date',
      moment: 'moment',
      time: 'time',
      object: 'object'
    },
    colors:{
      primary: 'primary',
      secondary: 'secondary',
      danger: 'danger',
      light: 'light',
      dark: 'dark'
    }
  },
  permissions:{
    ACCESS_CHECKIN_PROPERTIES: 'ACCESS_CHECKIN_PROPERTIES',
    ACCESS_COARSE_LOCATION: 'ACCESS_COARSE_LOCATION',
    ACCESS_FINE_LOCATION: 'ACCESS_FINE_LOCATION',
    ACCESS_LOCATION_EXTRA_COMMANDS: 'ACCESS_LOCATION_EXTRA_COMMANDS',
    ACCESS_MOCK_LOCATION: 'ACCESS_MOCK_LOCATION',
    ACCESS_NETWORK_STATE: 'ACCESS_NETWORK_STATE',
    ACCESS_SURFACE_FLINGER: 'ACCESS_SURFACE_FLINGER',
    ACCESS_WIFI_STATE: 'ACCESS_WIFI_STATE',
    ACCOUNT_MANAGER: 'ACCOUNT_MANAGER',
    ADD_VOICEMAIL: 'ADD_VOICEMAIL',
    AUTHENTICATE_ACCOUNTS: 'AUTHENTICATE_ACCOUNTS',
    BATTERY_STATS: 'BATTERY_STATS',
    BIND_ACCESSIBILITY_SERVICE: 'BIND_ACCESSIBILITY_SERVICE',
    BIND_APPWIDGET: 'BIND_APPWIDGET',
    BIND_CARRIER_MESSAGING_SERVICE: 'BIND_CARRIER_MESSAGING_SERVICE',
    BIND_DEVICE_ADMIN: 'BIND_DEVICE_ADMIN',
    BIND_DREAM_SERVICE: 'BIND_DREAM_SERVICE',
    BIND_INPUT_METHOD: 'BIND_INPUT_METHOD',
    BIND_NFC_SERVICE: 'BIND_NFC_SERVICE',
    BIND_NOTIFICATION_LISTENER_SERVICE: 'BIND_NOTIFICATION_LISTENER_SERVICE',
    BIND_PRINT_SERVICE: 'BIND_PRINT_SERVICE',
    BIND_REMOTEVIEWS: 'BIND_REMOTEVIEWS',
    BIND_TEXT_SERVICE: 'BIND_TEXT_SERVICE',
    BIND_TV_INPUT: 'BIND_TV_INPUT',
    BIND_VOICE_INTERACTION: 'BIND_VOICE_INTERACTION',
    BIND_VPN_SERVICE: 'BIND_VPN_SERVICE',
    BIND_WALLPAPER: 'BIND_WALLPAPER',
    BLUETOOTH: 'BLUETOOTH',
    BLUETOOTH_ADMIN: 'BLUETOOTH_ADMIN',
    BLUETOOTH_PRIVILEGED: 'BLUETOOTH_PRIVILEGED',
    BODY_SENSORS: 'BODY_SENSORS',
    BRICK: 'BRICK',
    BROADCAST_PACKAGE_REMOVED: 'BROADCAST_PACKAGE_REMOVED',
    BROADCAST_SMS: 'BROADCAST_SMS',
    BROADCAST_STICKY: 'BROADCAST_STICKY',
    BROADCAST_WAP_PUSH: 'BROADCAST_WAP_PUSH',
    CALL_PHONE: 'CALL_PHONE',
    CALL_PRIVILEGED: 'CALL_PRIVILEGED',
    CAMERA: 'CAMERA',
    CAPTURE_AUDIO_OUTPUT: 'CAPTURE_AUDIO_OUTPUT',
    CAPTURE_SECURE_VIDEO_OUTPUT: 'CAPTURE_SECURE_VIDEO_OUTPUT',
    CAPTURE_VIDEO_OUTPUT: 'CAPTURE_VIDEO_OUTPUT',
    CHANGE_COMPONENT_ENABLED_STATE: 'CHANGE_COMPONENT_ENABLED_STATE',
    CHANGE_CONFIGURATION: 'CHANGE_CONFIGURATION',
    CHANGE_NETWORK_STATE: 'CHANGE_NETWORK_STATE',
    CHANGE_WIFI_MULTICAST_STATE: 'CHANGE_WIFI_MULTICAST_STATE',
    CHANGE_WIFI_STATE: 'CHANGE_WIFI_STATE',
    CLEAR_APP_CACHE: 'CLEAR_APP_CACHE',
    CLEAR_APP_USER_DATA: 'CLEAR_APP_USER_DATA',
    CONTROL_LOCATION_UPDATES: 'CONTROL_LOCATION_UPDATES',
    DELETE_CACHE_FILES: 'DELETE_CACHE_FILES',
    DELETE_PACKAGES: 'DELETE_PACKAGES',
    DEVICE_POWER: 'DEVICE_POWER',
    DIAGNOSTIC: 'DIAGNOSTIC',
    DISABLE_KEYGUARD: 'DISABLE_KEYGUARD',
    DUMP: 'DUMP',
    EXPAND_STATUS_BAR: 'EXPAND_STATUS_BAR',
    FACTORY_TEST: 'FACTORY_TEST',
    FLASHLIGHT: 'FLASHLIGHT',
    FORCE_BACK: 'FORCE_BACK',
    GET_ACCOUNTS: 'GET_ACCOUNTS',
    GET_PACKAGE_SIZE: 'GET_PACKAGE_SIZE',
    GET_TASKS: 'GET_TASKS',
    GET_TOP_ACTIVITY_INFO: 'GET_TOP_ACTIVITY_INFO',
    GLOBAL_SEARCH: 'GLOBAL_SEARCH',
    HARDWARE_TEST: 'HARDWARE_TEST',
    INJECT_EVENTS: 'INJECT_EVENTS',
    INSTALL_LOCATION_PROVIDER: 'INSTALL_LOCATION_PROVIDER',
    INSTALL_PACKAGES: 'INSTALL_PACKAGES',
    INSTALL_SHORTCUT: 'INSTALL_SHORTCUT',
    INTERNAL_SYSTEM_WINDOW: 'INTERNAL_SYSTEM_WINDOW',
    INTERNET: 'INTERNET',
    KILL_BACKGROUND_PROCESSES: 'KILL_BACKGROUND_PROCESSES',
    LOCATION_HARDWARE: 'LOCATION_HARDWARE',
    MANAGE_ACCOUNTS: 'MANAGE_ACCOUNTS',
    MANAGE_APP_TOKENS: 'MANAGE_APP_TOKENS',
    MANAGE_DOCUMENTS: 'MANAGE_DOCUMENTS',
    MASTER_CLEAR: 'MASTER_CLEAR',
    MEDIA_CONTENT_CONTROL: 'MEDIA_CONTENT_CONTROL',
    MODIFY_AUDIO_SETTINGS: 'MODIFY_AUDIO_SETTINGS',
    MODIFY_PHONE_STATE: 'MODIFY_PHONE_STATE',
    MOUNT_FORMAT_FILESYSTEMS: 'MOUNT_FORMAT_FILESYSTEMS',
    MOUNT_UNMOUNT_FILESYSTEMS: 'MOUNT_UNMOUNT_FILESYSTEMS',
    NFC: 'NFC',
    PERSISTENT_ACTIVITY: 'PERSISTENT_ACTIVITY',
    PROCESS_OUTGOING_CALLS: 'PROCESS_OUTGOING_CALLS',
    READ_CALENDAR: 'READ_CALENDAR',
    READ_CALL_LOG: 'READ_CALL_LOG',
    READ_CONTACTS: 'READ_CONTACTS',
    READ_EXTERNAL_STORAGE: 'READ_EXTERNAL_STORAGE',
    READ_FRAME_BUFFER: 'READ_FRAME_BUFFER',
    READ_HISTORY_BOOKMARKS: 'READ_HISTORY_BOOKMARKS',
    READ_INPUT_STATE: 'READ_INPUT_STATE',
    READ_LOGS: 'READ_LOGS',
    READ_PHONE_STATE: 'READ_PHONE_STATE',
    READ_PROFILE: 'READ_PROFILE',
    READ_SMS: 'READ_SMS',
    READ_SOCIAL_STREAM: 'READ_SOCIAL_STREAM',
    READ_SYNC_SETTINGS: 'READ_SYNC_SETTINGS',
    READ_SYNC_STATS: 'READ_SYNC_STATS',
    READ_USER_DICTIONARY: 'READ_USER_DICTIONARY',
    READ_VOICEMAIL: 'READ_VOICEMAIL',
    REBOOT: 'REBOOT',
    RECEIVE_BOOT_COMPLETED: 'RECEIVE_BOOT_COMPLETED',
    RECEIVE_MMS: 'RECEIVE_MMS',
    RECEIVE_SMS: 'RECEIVE_SMS',
    RECEIVE_WAP_PUSH: 'RECEIVE_WAP_PUSH',
    RECORD_AUDIO: 'RECORD_AUDIO',
    REORDER_TASKS: 'REORDER_TASKS',
    RESTART_PACKAGES: 'RESTART_PACKAGES',
    SEND_RESPOND_VIA_MESSAGE: 'SEND_RESPOND_VIA_MESSAGE',
    SEND_SMS: 'SEND_SMS',
    SET_ACTIVITY_WATCHER: 'SET_ACTIVITY_WATCHER',
    SET_ALARM: 'com.android.alarm.permission.SET_ALARM',
    SET_ALWAYS_FINISH: 'SET_ALWAYS_FINISH',
    SET_ANIMATION_SCALE: 'SET_ANIMATION_SCALE',
    SET_DEBUG_APP: 'SET_DEBUG_APP',
    SET_ORIENTATION: 'SET_ORIENTATION',
    SET_POINTER_SPEED: 'SET_POINTER_SPEED',
    SET_PREFERRED_APPLICATIONS: 'SET_PREFERRED_APPLICATIONS',
    SET_PROCESS_LIMIT: 'SET_PROCESS_LIMIT',
    SET_TIME: 'SET_TIME',
    SET_TIME_ZONE: 'SET_TIME_ZONE',
    SET_WALLPAPER: 'SET_WALLPAPER',
    SET_WALLPAPER_HINTS: 'SET_WALLPAPER_HINTS',
    SIGNAL_PERSISTENT_PROCESSES: 'SIGNAL_PERSISTENT_PROCESSES',
    STATUS_BAR: 'STATUS_BAR',
    SUBSCRIBED_FEEDS_READ: 'SUBSCRIBED_FEEDS_READ',
    SUBSCRIBED_FEEDS_WRITE: 'SUBSCRIBED_FEEDS_WRITE',
    SYSTEM_ALERT_WINDOW: 'SYSTEM_ALERT_WINDOW',
    TRANSMIT_IR: 'TRANSMIT_IR',
    UNINSTALL_SHORTCUT: 'UNINSTALL_SHORTCUT',
    UPDATE_DEVICE_STATS: 'UPDATE_DEVICE_STATS',
    USE_CREDENTIALS: 'USE_CREDENTIALS',
    USE_SIP: 'USE_SIP',
    VIBRATE: 'VIBRATE',
    WAKE_LOCK: 'WAKE_LOCK',
    WRITE_APN_SETTINGS: 'WRITE_APN_SETTINGS',
    WRITE_CALENDAR: 'WRITE_CALENDAR',
    WRITE_CALL_LOG: 'WRITE_CALL_LOG',
    WRITE_CONTACTS: 'WRITE_CONTACTS',
    WRITE_EXTERNAL_STORAGE: 'WRITE_EXTERNAL_STORAGE',
    WRITE_GSERVICES: 'WRITE_GSERVICES',
    WRITE_HISTORY_BOOKMARKS: 'WRITE_HISTORY_BOOKMARKS',
    WRITE_PROFILE: 'WRITE_PROFILE',
    WRITE_SECURE_SETTINGS: 'WRITE_SECURE_SETTINGS',
    WRITE_SETTINGS: 'WRITE_SETTINGS',
    WRITE_SMS: 'WRITE_SMS',
    WRITE_SOCIAL_STREAM: 'WRITE_SOCIAL_STREAM',
    WRITE_SYNC_SETTINGS: 'WRITE_SYNC_SETTINGS',
    WRITE_USER_DICTIONARY: 'WRITE_USER_DICTIONARY',
    WRITE_VOICEMAIL: 'WRITE_VOICEMAIL',
  }
};

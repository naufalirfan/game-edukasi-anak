using System;
using UnityEngine;

namespace MAS.GameEdukasi
{
    /// <summary>Daily screen-time limiter per profile. TODO: parental dashboard config.</summary>
    public class ScreenTimeManager : MonoBehaviour
    {
        [SerializeField] int dailyLimitMinutes = 30;
        float sessionSeconds;
        DateTime lastDate = DateTime.Today;
        const string PrefsKey = "mas_screentime_v1";

        public event Action OnLimitReached;

        void Awake() => Load();
        void OnEnable() => Load();

        void Update()
        {
            if (DateTime.Today != lastDate) { sessionSeconds = 0; lastDate = DateTime.Today; Save(); }
            sessionSeconds += Time.deltaTime;
            if (sessionSeconds >= dailyLimitMinutes * 60f)
            {
                OnLimitReached?.Invoke();
                enabled = false; // pause counting until next day or reset
            }
        }

        public float RemainingSeconds => Math.Max(0, dailyLimitMinutes * 60f - sessionSeconds);
        public bool IsLimitReached => RemainingSeconds <= 0;
        public void AddMinutes(int m) { dailyLimitMinutes = Math.Max(5, dailyLimitMinutes + m); Save(); }

        void Save() => PlayerPrefs.SetFloat(PrefsKey, sessionSeconds);
        void Load() { if (PlayerPrefs.HasKey(PrefsKey)) sessionSeconds = PlayerPrefs.GetFloat(PrefsKey); }
    }
}

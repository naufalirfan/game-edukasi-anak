using System;
using System.Collections.Generic;
using UnityEngine;

namespace MAS.GameEdukasi
{
    /// <summary>Tracks per-profile progress per module. Offline-first. TODO: Firebase/AWS sync.</summary>
    public class ProgressManager : MonoBehaviour
    {
        public static ProgressManager Instance { get; private set; }

        [Serializable] public class ModuleProgress { public string moduleId; public int stars; public int completedLevels; public int totalLevels = 10; public float bestScore; }
        [Serializable] public class ProfileProgress { public string profileId; public List<ModuleProgress> modules = new(); }

        [SerializeField] List<ProfileProgress> all = new();
        const string PrefsKey = "mas_progress_v1";

        void Awake()
        {
            if (Instance != null && Instance != this) { Destroy(gameObject); return; }
            Instance = this; DontDestroyOnLoad(gameObject); Load();
        }

        public ModuleProgress GetOrCreate(string profileId, string moduleId)
        {
            var pp = all.Find(x => x.profileId == profileId);
            if (pp == null) { pp = new ProfileProgress{ profileId = profileId }; all.Add(pp); }
            var m = pp.modules.Find(x => x.moduleId == moduleId);
            if (m == null) { m = new ModuleProgress{ moduleId = moduleId }; pp.modules.Add(m); }
            return m;
        }

        public void ReportLevelComplete(string profileId, string moduleId, int level, int stars, float score)
        {
            var m = GetOrCreate(profileId, moduleId);
            m.completedLevels = Math.Max(m.completedLevels, level);
            m.stars = Math.Max(m.stars, stars);
            m.bestScore = Math.Max(m.bestScore, score);
            Save();
        }

        public float OverallCompletion(string profileId)
        {
            var pp = all.Find(x => x.profileId == profileId);
            if (pp == null || pp.modules.Count == 0) return 0f;
            float sum = 0; foreach (var m in pp.modules) sum += (float)m.completedLevels / Math.Max(1, m.totalLevels);
            return sum / pp.modules.Count;
        }

        void Save() { try { PlayerPrefs.SetString(PrefsKey, JsonUtility.ToJson(new Wrapper{ list = all })); PlayerPrefs.Save(); } catch (Exception e) { Debug.LogWarning(e.Message); } }
        void Load() { if (!PlayerPrefs.HasKey(PrefsKey)) return; try { var w = JsonUtility.FromJson<Wrapper>(PlayerPrefs.GetString(PrefsKey)); if (w?.list != null) all = w.list; } catch {} }
        [Serializable] class Wrapper { public List<ProfileProgress> list; }
    }
}

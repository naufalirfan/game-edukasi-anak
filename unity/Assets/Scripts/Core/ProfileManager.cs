using System;
using System.Collections.Generic;
using UnityEngine;

namespace MAS.GameEdukasi
{
    /// <summary>Multi-profile manager. Persists to PlayerPrefs / JSON. TODO: encrypt, Firebase sync.</summary>
    public class ProfileManager : MonoBehaviour
    {
        public static ProfileManager Instance { get; private set; }

        [Serializable]
        public class ChildProfile
        {
            public string id;
            public string displayName;
            public int age; // 4-8
            public string avatarId;
            public DateTime createdAt;
        }

        [SerializeField] int maxProfiles = 4;
        public List<ChildProfile> profiles = new();
        public ChildProfile ActiveProfile { get; private set; }

        const string PrefsKey = "mas_profiles_v1";

        void Awake()
        {
            if (Instance != null && Instance != this) { Destroy(gameObject); return; }
            Instance = this;
            DontDestroyOnLoad(gameObject);
            Load();
        }

        public bool CreateProfile(string name, int age, string avatarId)
        {
            if (profiles.Count >= maxProfiles) return false;
            if (string.IsNullOrWhiteSpace(name) || age < 4 || age > 8) return false;
            var p = new ChildProfile { id = Guid.NewGuid().ToString("N"), displayName = name.Trim(), age = age, avatarId = avatarId, createdAt = DateTime.UtcNow };
            profiles.Add(p);
            Save();
            return true;
        }

        public bool SelectProfile(string id)
        {
            var p = profiles.Find(x => x.id == id);
            if (p == null) return false;
            ActiveProfile = p;
            return true;
        }

        public bool DeleteProfile(string id)
        {
            int n = profiles.RemoveAll(x => x.id == id);
            if (ActiveProfile != null && ActiveProfile.id == id) ActiveProfile = null;
            if (n > 0) Save();
            return n > 0;
        }

        void Save()
        {
            // ponytail: PlayerPrefs has size limit; upgrade to file + cloud sync when profiles grow
            try { PlayerPrefs.SetString(PrefsKey, JsonUtility.ToJson(new Wrapper{ list = profiles })); PlayerPrefs.Save(); } catch (Exception e) { Debug.LogWarning($"[ProfileManager] Save failed: {e.Message}"); }
        }

        void Load()
        {
            if (!PlayerPrefs.HasKey(PrefsKey)) return;
            try { var w = JsonUtility.FromJson<Wrapper>(PlayerPrefs.GetString(PrefsKey)); if (w?.list != null) profiles = w.list; } catch { /* ignore corrupt */ }
        }

        [Serializable] class Wrapper { public List<ChildProfile> list; }
    }
}

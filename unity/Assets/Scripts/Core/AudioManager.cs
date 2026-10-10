using UnityEngine;

namespace MAS.GameEdukasi
{
    /// <summary>Central audio + voice-over. TODO: addressables, per-profile volume.</summary>
    public class AudioManager : MonoBehaviour
    {
        public static AudioManager Instance { get; private set; }

        [SerializeField] AudioSource musicSource;
        [SerializeField] AudioSource sfxSource;
        [SerializeField] AudioSource voiceSource;

        void Awake()
        {
            if (Instance != null && Instance != this) { Destroy(gameObject); return; }
            Instance = this; DontDestroyOnLoad(gameObject);
            if (musicSource == null) musicSource = gameObject.AddComponent<AudioSource>();
            if (sfxSource == null) sfxSource = gameObject.AddComponent<AudioSource>();
            if (voiceSource == null) voiceSource = gameObject.AddComponent<AudioSource>();
            musicSource.loop = true;
        }

        public void PlayMusic(AudioClip clip, float fade = 0.3f)
        {
            if (clip == null) return;
            musicSource.clip = clip; musicSource.volume = 0.7f; musicSource.Play();
            // TODO: fade with coroutine
        }

        public void PlaySfx(AudioClip clip, float volume = 1f) { if (clip) sfxSource.PlayOneShot(clip, volume); }
        public void PlayVoice(AudioClip clip) { if (clip == null) return; voiceSource.Stop(); voiceSource.clip = clip; voiceSource.Play(); }
        public void StopVoice() => voiceSource.Stop();
        public void SetMasterVolume(float v) => AudioListener.volume = Mathf.Clamp01(v);
    }
}

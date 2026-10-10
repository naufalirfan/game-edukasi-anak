# Game Edukasi Anak — Unity Project

Anak 4-8 tahun | iOS + Android | Offline-first | Firebase/AWS backend (planned)

## Open in Unity Hub

1. Install **Unity 2022.3 LTS** (tested 2022.3.20f1) via Unity Hub.
2. `Add` → select `unity/` folder (this folder contains `ProjectSettings/` and `Packages/`).
3. Open. If Unity prompts to upgrade packages, accept.

> Bundle ID: `com.mas.gameedukasi` (PlayerSettings). 2D project.

## Structure

```
Assets/
  Scripts/Core/       ProfileManager, ProgressManager, ParentalGate, ScreenTimeManager, AudioManager
  Scripts/Modules/    LogikaModule, BahasaModule, KreativitasModule
  Scripts/UI/         ProfileSelectorUI, ModuleCardUI, RewardUI
  Scenes/             Main, ProfileSelect, Gameplay, ParentalDashboard
  Prefabs/            (placeholder)
  Audio/              (placeholder)
  Sprites/            (placeholder)
ProjectSettings/      ProjectVersion 2022.3.20f1, minimal PlayerSettings
Packages/             manifest + lock (ugui, TextMeshPro, Timeline, 2D)
```

## Next steps

- Create UI prefabs & wire to scripts (TODOs in code).
- Add Firebase SDK / AWS Amplify (outside this scaffold).
- Add Addressables for offline audio packs.

## Notes

- All C# scripts use `namespace MAS.GameEdukasi`, compilable with no extra deps.
- Minimal scenes are empty and valid YAML — add cameras/canvas in editor.

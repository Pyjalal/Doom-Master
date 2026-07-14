#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  tauri::Builder::default()
    .setup(|app| {
      if cfg!(debug_assertions) {
        app.handle().plugin(
          tauri_plugin_log::Builder::default()
            .level(log::LevelFilter::Info)
            .build(),
        )?;
      }
      // Doom One bg — prevents WebView2 white strip in fullscreen/maximized.
      use tauri::{Manager, window::Color};
      if let Some(win) = app.get_webview_window("main") {
        let color = Color::from((26u8, 27u8, 38u8, 255u8));
        let _ = win.set_background_color(Some(color));
        // Shadow on undecorated Windows windows draws a 1px light border.
        let _ = win.set_shadow(false);
      }
      Ok(())
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}

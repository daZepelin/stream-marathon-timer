#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
// ignore unused variables
#![allow(unused_variables)]

use actix_cors::Cors;
use actix_web::{get, App, HttpResponse, HttpServer, Responder};
// use tauri::api::path;
use dirs::data_local_dir;
use serde::{Deserialize, Serialize};
use serde_json;

#[derive(Serialize, Deserialize)]
struct TimerData {
    style: serde_json::Value,
    config: serde_json::Value,
}

use std::fs;

fn read_data_file(filename: &str) -> Result<String, std::io::Error> {
    println!(
        "Reading data file: {}, path: {}",
        filename,
        data_local_dir().unwrap().display()
    );
    if let Some(mut data_path) = data_local_dir() {
        data_path.push(filename); // Append the filename to the path
        fs::read_to_string(data_path) // Use standard Rust's fs module to read the file to a String
    } else {
        Err(std::io::Error::new(
            std::io::ErrorKind::NotFound,
            "Data directory not found",
        ))
    }
}

#[get("/time")]
async fn get_time() -> impl Responder {
    match read_data_file("subathon-timer-bot/subathon/time.txt") {
        Ok(time) => return HttpResponse::Ok().body(time),
        Err(_) => return HttpResponse::Ok().body("600"),
    }
}

#[get("/auth_keys")]
async fn get_auth_keys() -> impl Responder {
    let auth_keys_file_result = read_data_file("subathon-timer-bot/auth/keys.json");

    match auth_keys_file_result {
        Ok(auth_keys) => return HttpResponse::Ok().body(auth_keys),
        Err(_) => return HttpResponse::Ok().body("[]"),
    }
}

#[get("/timer_cfg")]
async fn get_timer_cfg() -> impl Responder {

    let style_file_result = read_data_file("subathon-timer-bot/subathon/style.json");

    // Read the second file
    let config_file_result = read_data_file("subathon-timer-bot/subathon/config.json");

    // Combine the data from both files into a TimerData struct
    let mut combined_data = TimerData {
        style: serde_json::from_str("[]").expect("JSON was not well-formatted"),
        config: serde_json::from_str("[]").expect("JSON was not well-formatted"),
    };

    // Update fields if files were successfully read
    if let Ok(style) = style_file_result {
        let json_style: serde_json::Value =
            serde_json::from_str(&style).expect("JSON was not well-formatted");
        combined_data.style = json_style;
    }

    if let Ok(config) = config_file_result {
        // combined_data.config = config;

        let json_config: serde_json::Value =
            serde_json::from_str(&config).expect("JSON was not well-formatted");
        combined_data.config = json_config;
    }

    // Serialize the TimerData struct to JSON
    let json_data = serde_json::to_string(&combined_data).unwrap();

    HttpResponse::Ok()
        .content_type("application/json")
        .body(json_data)
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_localhost::Builder::new(1427).build())
        .setup(|app| {
            tauri::async_runtime::spawn(
                HttpServer::new(|| {
                    let cors = Cors::default()
                        .allowed_origin("http://localhost:1424")
                        .allowed_origin("http://localhost:1427")
                        .allowed_origin("https://tauri.localhost");

                    App::new()
                        .wrap(cors)
                        .service(get_time)
                        .service(get_auth_keys)
                        .service(get_timer_cfg)
                })
                .bind(("127.0.0.1", 1425))?
                .run(),
            );
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

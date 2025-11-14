#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
// ignore unused variables
#![allow(unused_variables)]

use actix_cors::Cors;
use actix_web::{get, App, HttpResponse, HttpServer, Responder, web};
use dirs::data_local_dir;
use serde::{Deserialize, Serialize};
use serde_json::{self, Value};
use std::fs;
use std::path::PathBuf;
use chrono::Local;

static mut IS_TIMER_ACTIVE: bool = false;

#[derive(Serialize, Deserialize)]
struct TimerData {
    style: Value,
    config: Value,
    special_multiplier: Value,
}

enum LogType {
    Labs,
    Elements,
}

/// Ensure directory exists for a given path
fn ensure_parent_dir(path: &PathBuf) -> Result<(), std::io::Error> {
    if let Some(parent) = path.parent() {
        fs::create_dir_all(parent)?;
    }
    Ok(())
}

/// Write a timestamped log entry to the selected file
fn write_log(log_type: LogType, content: &str) -> Result<(), std::io::Error> {
    let mut path = match data_local_dir() {
        Some(dir) => dir,
        None => {
            return Err(std::io::Error::new(
                std::io::ErrorKind::NotFound,
                "Data directory not found",
            ))
        }
    };

    match log_type {
        LogType::Labs => path.push("subathon-timer-bot/logs/logs_labs.txt"),
        LogType::Elements => path.push("subathon-timer-bot/logs/logs_elements.txt"),
    }

    ensure_parent_dir(&path)?;

    let timestamp = Local::now().format("[%Y-%m-%d %H:%M:%S]").to_string();

    use std::io::Write;
    let mut file = fs::OpenOptions::new()
        .create(true)
        .append(true)
        .open(&path)?;

    writeln!(file, "{} {}", timestamp, content)?;

    Ok(())
}

/// Read a file safely
fn read_data_file(filename: &str) -> Result<String, std::io::Error> {
    let mut path = match data_local_dir() {
        Some(dir) => dir,
        None => {
            return Err(std::io::Error::new(
                std::io::ErrorKind::NotFound,
                "Data directory not found",
            ))
        }
    };

    path.push(filename);

    println!("Reading data file: {}", path.display());

    ensure_parent_dir(&path)?;
    fs::read_to_string(path)
}

/// Safe JSON read fallback
fn read_json_or_default(path: &str, fallback: Value) -> Value {
    match read_data_file(path) {
        Ok(content) => serde_json::from_str::<Value>(&content).unwrap_or(fallback),
        Err(_) => fallback,
    }
}

#[get("/time")]
async fn get_time() -> impl Responder {
    let default_time = "600".to_string();

    let time = read_data_file("subathon-timer-bot/subathon/time.txt")
        .unwrap_or(default_time);

    HttpResponse::Ok().body(time)
}

#[get("/auth_keys")]
async fn get_auth_keys() -> impl Responder {
    let data = read_data_file("subathon-timer-bot/auth/keys.json")
        .unwrap_or("[]".to_string());

    HttpResponse::Ok().body(data)
}

#[get("/timer_cfg")]
async fn get_timer_cfg() -> impl Responder {
    let combined_data = TimerData {
        style: read_json_or_default("subathon-timer-bot/subathon/style.json", Value::Array(vec![])),
        config: read_json_or_default("subathon-timer-bot/subathon/config.json", Value::Array(vec![])),
        special_multiplier: read_json_or_default(
            "subathon-timer-bot/subathon/special_multiplier.json",
            Value::Array(vec![]),
        ),
    };

    let json_data = serde_json::to_string(&combined_data).unwrap();

    HttpResponse::Ok()
        .content_type("application/json")
        .body(json_data)
}

#[get("/is_timer_active")]
async fn get_active() -> HttpResponse {
    unsafe {
        HttpResponse::Ok().json(serde_json::json!({ "isTimerActive": IS_TIMER_ACTIVE }))
    }
}

/// Query params for /log endpoint
#[derive(Deserialize)]
struct LogQuery {
    r#type: String,
    msg: String,
}

/// /log?type=labs&msg=Hello
#[get("/log")]
async fn api_log(query: web::Query<LogQuery>) -> impl Responder {
    let log_type = match query.r#type.to_lowercase().as_str() {
        "labs" => LogType::Labs,
        "elements" => LogType::Elements,
        _ => {
            return HttpResponse::BadRequest().body("Invalid log type. Use 'labs' or 'elements'.");
        }
    };

    let result = write_log(log_type, &query.msg);

    match result {
        Ok(_) => HttpResponse::Ok().body("Logged"),
        Err(_) => HttpResponse::InternalServerError().body("Failed to write log"),
    }
}

#[tauri::command]
fn set_timer_active(invoke_message: bool) {
    unsafe {
        IS_TIMER_ACTIVE = invoke_message;
    }
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_localhost::Builder::new(1427).build())
        .invoke_handler(tauri::generate_handler![set_timer_active])
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
                        .service(get_active)
                        .service(api_log)
                })
                .bind(("127.0.0.1", 1425))?
                .run(),
            );
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

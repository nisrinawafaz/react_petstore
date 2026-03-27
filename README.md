## Pengertian React

React adalah library JavaScript yang digunakan untuk membangun antarmuka pengguna (user interface) berbasis komponen. React dikembangkan oleh Meta dan banyak digunakan untuk membuat aplikasi web modern, khususnya single-page application (SPA).

## Kelebihan React dibandingkan dengan Angular

- Lebih Fleksibel
- Lebih Ringan
- Learning Curve Lebih Rendah
- Tidak banyak boilerplate.
- Lebih Mudah Integrasi

## Kekurangan React

- Tidak All-in-One
- Tidak ada standar baku sehingga struktur project bisa berbeda-beda.
- Dependency Lebih Banyak
- Karena fleksibel tiap developer bisa punya pendekatan berbeda.

## Persamaan Angular dan React

Meskipun memiliki pendekatan yang berbeda, React dan Angular memiliki beberapa konsep yang serupa:

1. **Component-Based Architecture**

Keduanya membangun UI dari komponen-komponen kecil yang bisa dipakai ulang.

2. **HTTP / API Calls**

Konsep memanggil API tetap sama — keduanya menggunakan `GET`, `POST`, `PUT`, `DELETE`. Yang berbeda hanya library-nya: Angular pakai `HttpClient`, React biasanya pakai `fetch` atau `axios`.

3. **Routing**

Keduanya punya sistem routing berbasis path mendukung navigasi antar halaman (single-page application). Angular pakai `@angular/router`, React pakai `react-router-dom`. Struktur route yang kita buat (`/pets`, `/pets/:id`, `/users`, dll) bisa diaplikasikan langsung di React.

---

## Perbedaan Angular dan React

1. **Framework vs Library**

Angular : Full framework sudah include router, HTTP client, form handling, DI.
React : Library UI hanya handle rendering, perlu library tambahan untuk fitur lain

2. **Template vs JSX**

Angular menggunakan HTML template terpisah dengan directive khusus. React menggunakan JSX yaitu HTML yang ditulis langsung di dalam JavaScript/TypeScript.

3. **Two-way Binding vs One-way Data Flow**

Angular mendukung two-way binding dengan `[(ngModel)]` — perubahan di UI langsung update data, dan sebaliknya. React menggunakan one-way data flow, data mengalir dari parent ke child, dan event handler digunakan untuk update state.

4. **Dependency Injection**

Angular punya sistem DI built-in — service di-inject lewat constructor. React tidak punya DI, sehingga menggunakan `Context API` atau state management library seperti `Redux` atau `Zustand`.

5. **JS vs TS**

React memiliki kebebasan memilih antara JS atau TS, sedangkan angular wajib menggunakan TS.

---

## Fitur yang Mirip, Hanya Beda Nama

| Konsep                     | Angular                            | React                                        |
| -------------------------- | ---------------------------------- | -------------------------------------------- |
| **Komponen**               | `@Component` + class               | Function component                           |
| **State lokal**            | Property di class                  | `useState()`                                 |
| **Data Binding**           | Input / Output                     | Props & State                                |
| **Lifecycle init**         | `ngOnInit()`                       | `useEffect(() => {}, [])`                    |
| **Kondisional render**     | `*ngIf`                            | `{condition && <Component />}`               |
| **Loop render**            | `*ngFor`                           | `.map()`                                     |
| **Styling**                | `.component.css`                   | `.module.css` / Tailwind / styled-components |
| **Routing**                | `RouterModule` + `app.routes.ts`   | `react-router-dom`                           |
| **Route params**           | `ActivatedRoute.snapshot.paramMap` | `useParams()`                                |
| **HTTP**                   | `HttpClient`                       | `axios / fetch` / `axios`                    |
| **Guard (proteksi route)** | `CanActivateFn`                    | Route wrapper component                      |
| **Interceptor**            | `HttpInterceptorFn`                | `axios interceptors` / middleware            |
| **Form validation**        | `Validators` + Zod                 | `React Hook Form` + Zod (`zodResolver`)      |
| **UI Library**             | Angular Material                   | MUI (Material UI)                            |
| **Service**                | `@Injectable` class                | Custom hook / Context                        |
| **Form Handling**          | Reactive Forms / Template Forms    | Controlled / React Hook Form                 |

---

## Tips Migrasi Angular ke React

Berikut beberapa tips agar proses migrasi lebih mudah:

1. **Menggunakan TS**

   Karena Angular wajib menggunakan TS, maka pada React juga menggunakan TS agar lebih mudah dalam melakukan migrasi

2. **Gunakan Pendekatan Bertahap**

   Memulai dari komponen kecil, jangan langsung migrasi seluruh aplikasi. Bisa dilakukan mulai dari component reusable, per halaman, atau per fitur.

3. **Mapping Konsep**
   Pahami padanan konsep Angular ke React:

- Component → Component
- Service → Custom Hook / utility function
- Lifecycle (ngOnInit) → useEffect
- Data binding → useState
- Routing → React Router

4. **Gunakan Library yang Setara**

   Form: gunakan react-hook-form
   HTTP: gunakan axios atau fetch
   validasi : gunakan zod
   UI: gunakan Material UI (setara Angular Material)

5. **Struktur Folder**

   Struktur folder dapat dibuat mirip dengan yang ada di project angular karena react bersifat fleksibel.

---

Link Demo : https://drive.google.com/drive/folders/1iz6SfgoSClv9R7QoQjzxhewBEuL4-I1T?usp=sharing

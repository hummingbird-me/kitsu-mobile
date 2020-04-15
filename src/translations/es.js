export default {
  components: {
    account: {
      password: "Contraseña",
      email: "Correo",
      username: "Nombre de usuario",
      confirmpassword: "Confirmar contraseña",
      create: "Crear cuenta",
      signin: "Entrar a mi cuenta",
      reset: "Restablecer contraseña",
      facebook: "Conectarse con Facebook",
      termspart1: "Al crear una cuenta, aceptas nuestros ",
      termspart2: "Términos de Servicio"
    },
    button: {
      save: "Guardar"
    },
    contentlist: {
      viewall: "Ver todo"
    },
    datepicker: {
      cancel: "Cancelar",
      select: "Seleccionar una fecha",
      confirm: "Confirmar"
    },
    feedback: {
      error: "Algo falló."
    },
    profileheader: {
      follow: "Seguir"
    },
    rating: {
      awful: "HORRIBLE",
      meh: "MEH",
      good: "BUENO",
      great: "GENIAL",
      error: "Esta función debiera ser usada solo en evaluaciones simples.",
      unknown: "Texto desconocido al determinar el tipo de evaluación simple:",
      notrated: "No evaluado",
      tap: "Toca",
      slide: "Desliza",
      torate: " para evaluar",
      slidetorate: "Desliza para evaluar",
      cancel: "Cancelar",
      done: "Hecho",
      norating: "Sin evaluación"
    },
    searchbox: {
      search: "Buscar"
    },
    viewmore: {
    more: "Ver más",
    less: "Ver menos",
    }
  },
  config: {
    middlewares: {
      error401: "Se recibió un 401",
      tokens: "Falló el refrescar los tokens",
      token: "Falló el refrescar el token"
    }
  },
  screens: {
    quickupdatescreen:{
      header: "Actualización rápida",
      error: "Error al actualizar el progreso, por favor vuelve a intentarlo.",
      ok: "ACEPTAR",
      startanime: "EMPIEZA A VER ANIME",
      startmanga: "EMPIEZA A LEER MANGA",
      startmedia: "EMPIEZA A SEGUIR MEDIOS",
      findanime: "Encuentra animes para ver",
      findmanga: "Encuentra mangas para leer",
      findmedia: "Encuentra medios a añadir",
      yourthoughts: "¿Que piensas del",
      discussion: "EMPIEZA LA DISCUSIÓN",
      sharethoughts: "Se de los primeros en compartir sus pensamientos sobre el %{type} %{number}",
      communitythoughts: "A medida que actualices tu progreso, ¡verás los pensamientos de la comunidad sobre el %{type} que has %{state}!",
      ep: "Ep",
      ch: "Cap",
      episode: "episodio",
      chapter: "capítulo",
      watched: "como visto",
      read: "como leído",
      card: {
        upnext: "SIGUIENTE",
        outof: " de %{count}",
        notstarted: "No iniciado",
        markcomplete: "Marcar como completado",
        mark: "Marcar",
        complete: "¡Serie completa! ¡Evalúala!"
      },
      editor: {
      share: "Comparte tus pensamientos sobre el episodio",
      episode: "Episodio",
      cancel: "Cancelar",
      done: "Hecho"
      }
    },
    sidebar: {
      sidebarscreen: {
        account: "Ajustes de la cuenta",
        settings: "Ajustes y preferencias",
        report: "Reportar Bugs",
        features: "Solicitar funcionalidades",
        database: "Solicitudes de la base de datos",
        contact: "Contáctanos",
        profile: "Ver perfil",
        logout: "Salir"
      }
    }
  },
  utils: {
    deeplink: {
      error: "Ocurrió un error",
      bugs: "Reportar Bugs",
      features: "Sugerir funcionalidades",
      database: "Solicitudes de base de datos"
    },
    genres: {
      action: "Acción",
      adventure: "Aventura",
      animeinfluenced: "Influenciado por anime",
      cars: "Automóviles",
      comedy: "Comedia",
      cooking: "Cocina",
      crime: "Crimen",
      dementia: "Demencia",
      demons: "Demonios",
      documentary: "Documental",
      doujinshi: "Doujinshi",
      drama: "Drama",
      ecchi: "Ecchi",
      family: "Familia",
      fantasy: "Fantasía",
      food: "Comida",
      friendship: "Amistad",
      game: "Juegos",
      genderbender: "Gender Bender",
      gore: "Gore",
      harem: "Harem",
      hentai: "Hentai",
      historical: "Historia",
      horror: "Horror",
      kids: "Niños",
      law: "Leyes",
      magic: "Magia",
      mahoushoujo: "Mahou Shoujo",
      mahoushounen: "Mahou Shounen",
      martialarts: "Artes marciales",
      mature: "Madurez",
      mecha: "Mecha",
      medical: "Medicina",
      military: "Militares",
      music: "Música",
      mystery: "Misterio",
      parody: "Parodia",
      police: "Policia",
      political: "Política",
      psychological: "Sicológico",
      racing: "Carreras",
      romance: "Romance",
      samurai: "Samurái",
      school: "Colegio",
      scifi: "Sci-Fi",
      shoujoai: "Shoujo Ai",
      shounenai: "Shounen Ai",
      sliceoflife: "Vida diaria",
      space: "Espacio",
      sports: "Deportes",
      superpower: "Super poderes",
      supernatural: "Supernatural",
      thriller: "Thriller",
      tokusatsu: "Tokusatsu",
      tragedy: "Tragedia",
      vampire: "Vampiros",
      workplace: "Lugar de trabajo",
      yaoi: "Yaoi",
      youth: "Juventud",
      yuri: "Yuri",
      zombies: "Zombis"
    },
    imageuploader: {
      uploading: "Ya se están subiendo las imágenes",
      missingtokens: "Faltan los tokens de autenticación",
      error: "Las imagenes deben contener las propiedades `uri` y `mime`."
    },
    notifications: {
      followed: "te siguió.",
      mentioned: "te mencionó en una publicación.",
      likedpost: "le puso me gusta a tu publicación.",
      likedcomment: "le puso me gusta a tu comentario.",
      invited: "te invitó a un grupo.",
      likedreaction: "le puso me gusta a tu reacción.",
      aired: {
        episode: "Episodio",
        chapter: "Capítulo",
        aired: "emitido",
        released: "liberado"
      },
      mentioned: "te mencionó en un comentario.",
      replied: "respondió a",
      action: "realizó una acción"
    }
  }
};
